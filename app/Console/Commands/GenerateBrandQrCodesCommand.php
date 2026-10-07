<?php

namespace App\Console\Commands;

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateBrandQrCodesCommand extends Command
{
    protected $signature = 'qr:generate-brand
                            {--path= : Output directory (default: public/qr-codes)}';

    protected $description = 'Generate permanent static PNG QR codes for website and social links';

    /**
     * Permanent destination URLs (no tracking tokens — QR encodes the URL itself and never expires).
     *
     * @var array<string, string>
     */
    private array $links = [
        'website' => 'https://almajdluxurytransport.com',
        'instagram' => 'https://www.instagram.com/almajd.luxury.car/',
        'facebook' => 'https://www.facebook.com/share/1DAAgfkpHy/',
        'tiktok' => 'https://www.tiktok.com/@almajd_luxury_car',
        'snapchat' => 'https://www.snapchat.com/add/almajdluxurycar',
    ];

    public function handle(): int
    {
        $dir = $this->option('path') ?: public_path('qr-codes');
        File::ensureDirectoryExists($dir);

        $manifest = [];

        foreach ($this->links as $name => $url) {
            $filename = "almajd-{$name}.png";
            $filepath = $dir.DIRECTORY_SEPARATOR.$filename;

            $result = (new Builder(
                writer: new PngWriter(),
                writerOptions: [],
                validateResult: false,
                data: $url,
                encoding: new Encoding('UTF-8'),
                errorCorrectionLevel: ErrorCorrectionLevel::High,
                size: 800,
                margin: 20,
                roundBlockSizeMode: RoundBlockSizeMode::Margin,
            ))->build();

            File::put($filepath, $result->getString());

            $manifest[$name] = [
                'file' => $filename,
                'url' => $url,
                'path' => $filepath,
            ];

            $this->info("Created {$filename} → {$url}");
        }

        File::put(
            $dir.DIRECTORY_SEPARATOR.'manifest.json',
            json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES).PHP_EOL
        );

        $this->newLine();
        $this->info("Done. Static QR PNGs saved in: {$dir}");
        $this->comment('These encode the URLs directly — they do not expire.');

        return self::SUCCESS;
    }
}
