<?php

namespace Database\Seeders;

use App\Models\ExplorePlace;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ExplorePlaceSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->rows() as $index => $row) {
            ExplorePlace::query()->updateOrCreate(
                [
                    'category' => $row['category'],
                    'slug' => $row['slug'],
                ],
                [
                    'title' => $row['title'],
                    'body' => $row['body'] ?? null,
                    'image_path' => $row['image_path'] ?? null,
                    'label' => $row['label'] ?? $row['title'],
                    'area' => $row['area'] ?? null,
                    'show_in_carousel' => $row['show_in_carousel'] ?? false,
                    'show_in_scheduler' => $row['show_in_scheduler'] ?? true,
                    'sort_order' => $row['sort_order'] ?? $index,
                    'status' => 'active',
                ],
            );
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function rows(): array
    {
        $rows = [];

        // ——— Hotels ———
        $hotelCards = [
            ['four-seasons', 'Four Seasons Hotel Doha', 'West Bay waterfront icon — airport Meet & Greet and lobby drop-off timed to your check-in.', '/images/hotels/four-seasons.jpg', 'West Bay'],
            ['st-regis', 'The St. Regis Doha', 'Classic West Bay hospitality. Discreet chauffeur service for arrivals, dinners, and events.', '/images/hotels/st-regis.jpg', 'West Bay'],
            ['mandarin', 'Mandarin Oriental, Doha', 'Msheireb elegance. Seamless transfers between the hotel, Corniche, and Hamad Airport.', '/images/hotels/mandarin.jpg', 'MIA Park'],
            ['w-doha', 'W Doha Hotel & Residences', 'West Bay energy — night outs, meetings, and early flights with the same reliable chauffeur.', '/images/hotels/w-doha.jpg', 'West Bay'],
            ['ritz', 'The Ritz-Carlton, Doha', 'Lagoon-side calm. Ideal for family days, beach clubs, and punctual airport runs.', '/images/hotels/ritz.jpg', 'West Bay Lagoon'],
            ['sharq', 'Sharq Village & Spa', 'Corniche resort living — spa mornings and city evenings without parking stress.', '/images/hotels/sharq.jpg', 'Al Corniche'],
            ['marsa-malaz', 'Marsa Malaz Kempinski', 'The Pearl’s palace hotel. Marina dinners and island-style arrivals, chauffeured.', '/images/hotels/marsa-malaz.jpg', 'The Pearl'],
            ['banana-island', 'Banana Island Resort Doha', 'Private-island escape — coordinated transfers to the boat and back to the city.', '/images/hotels/banana-island.jpg', 'Banana Island'],
        ];
        foreach ($hotelCards as $i => [$slug, $title, $body, $img, $area]) {
            $rows[] = $this->card('hotel', $slug, $title, $body, $img, $area, $i);
        }
        foreach ([
            ['sheraton-grand', 'Sheraton Grand Doha', 'West Bay'],
            ['raffles', 'Raffles Doha', 'West Bay'],
            ['fairmont', 'Fairmont Doha', 'West Bay'],
            ['intercontinental-beach', 'InterContinental Doha Beach & Spa', 'West Bay'],
            ['intercontinental-city', 'InterContinental Doha The City', 'West Bay'],
            ['grand-hyatt', 'Grand Hyatt Doha', 'West Bay'],
            ['hyatt-regency-oryx', 'Hyatt Regency Oryx Doha', 'Airport Road'],
            ['hilton-doha', 'Hilton Doha', 'West Bay'],
            ['hilton-pearl', 'Hilton Doha The Pearl', 'The Pearl'],
            ['marriott-marquis', 'Marriott Marquis City Center Doha', 'West Bay'],
            ['le-royal-meridien', 'Le Royal Méridien Doha', 'West Bay'],
            ['pullman-west-bay', 'Pullman Doha West Bay', 'West Bay'],
            ['banyan-tree', 'Banyan Tree Doha', 'West Bay'],
            ['the-ned', 'The Ned Doha', 'Msheireb'],
            ['al-messila', 'Al Messila, a Luxury Collection Resort & Spa', 'Al Messila'],
            ['sealine-resort', 'Sealine Beach Resort', 'Mesaieed'],
            ['radisson-blu', 'Radisson Blu Doha', 'Salwa Road'],
            ['millennium', 'Millennium Hotel Doha', 'Bin Mahmoud'],
            ['la-cigale', 'La Cigale Hotel Doha', 'Bin Mahmoud'],
            ['steigenberger', 'Steigenberger Hotel Doha', 'Al Sadd'],
            ['dusit', 'Dusit Doha Hotel', 'West Bay'],
            ['dusit-d2-salwa', 'DusitD2 Salwa Doha', 'Salwa Road'],
            ['the-curve', 'The Curve Hotel', 'Lusail'],
            ['fraser-suites', 'Fraser Suites Doha', 'West Bay'],
            ['kempinski-residences', 'Kempinski Residences & Suites Doha', 'West Bay'],
            ['somerset-west-bay', 'Somerset West Bay Suites', 'West Bay'],
        ] as $i => [$slug, $label, $area]) {
            $rows[] = $this->schedulerOnly('hotel', $slug, $label, $area, 100 + $i);
        }

        // ——— Beaches ———
        $beachCards = [
            ['katara-beach', 'Katara Beach', 'West Bay Lagoon sand and cafés — curb-side drop-off so the day starts on the shore.', '/images/beaches/katara.jpg', 'Beach'],
            ['sealine', 'Sealine Beach', 'Mesaieed dunes meet the Gulf. Ideal for a day trip with a waiting chauffeur.', '/images/beaches/sealine.jpg', 'Beach'],
            ['simaisma', 'Simaisma Beach', 'North-coast calm — family-friendly sands with a smooth hotel-to-beach transfer.', '/images/beaches/simaisma.jpg', 'Beach'],
            ['fuwairit', 'Fuwairit Beach', 'North Qatar stretch for quieter mornings — punctual pickup when the tide turns.', '/images/beaches/fuwairit.jpg', 'Beach'],
            ['ras-abrouq', 'Ras Abrouq (Zekreet)', 'West-coast cliffs and desert shoreline — scenic day rides with local chauffeurs.', '/images/beaches/ras-abrouq.jpg', 'Beach'],
            ['marsa-malaz', 'Marsa Malaz Beach', 'The Pearl’s resort beach — lobby to lounger without parking stress.', '/images/beaches/marsa-malaz.jpg', 'Resort'],
            ['four-seasons-beach', 'Four Seasons Doha Beach', 'West Bay resort shoreline — airport Meet & Greet then straight to the sand.', '/images/beaches/four-seasons.jpg', 'Resort'],
            ['banana-island', 'Banana Island Resort', 'Private-island escape — coordinated transfers to the boat and back to the city.', '/images/beaches/banana-island.jpg', 'Resort'],
        ];
        foreach ($beachCards as $i => [$slug, $title, $body, $img, $area]) {
            $rows[] = $this->card('beach', $slug, $title, $body, $img, $area, $i);
        }
        foreach ([
            ['west-bay-beach', 'West Bay Beach', 'Beach'],
            ['zekreet', 'Zekreet Beach', 'Beach'],
            ['al-wakrah-beach', 'Al Wakrah Beach', 'Beach'],
            ['dukhan-beach', 'Dukhan Beach', 'Beach'],
            ['974-beach', '974 Beach', 'Beach'],
            ['hilton-salwa', 'Hilton Salwa Beach Resort & Villas', 'Resort'],
            ['zulal', 'Zulal Wellness Resort by Chiva-Som', 'Resort'],
            ['ritz', 'The Ritz-Carlton, Doha', 'Resort'],
            ['sharq', 'Sharq Village & Spa, a Ritz-Carlton Hotel', 'Resort'],
            ['st-regis', 'The St. Regis Doha', 'Resort'],
            ['intercontinental-beach', 'InterContinental Doha Beach & Spa', 'Resort'],
            ['rixos-gulf', 'Rixos Gulf Hotel Doha', 'Resort'],
            ['hilton-pearl', 'Hilton Doha The Pearl', 'Resort'],
        ] as $i => [$slug, $label, $area]) {
            $rows[] = $this->schedulerOnly('beach', $slug, $label, $area, 100 + $i);
        }

        // ——— Malls ———
        $mallCards = [
            ['place-vendome', 'Place Vendôme Mall', 'Lusail’s grand shopping destination — porte-cochère drop-off without the parking hunt.', '/images/malls/place-vendome.jpg', 'Lusail'],
            ['mall-of-qatar', 'Mall of Qatar', 'Al Rayyan’s mega-mall. Family days and evening runs with a chauffeur who knows the entrances.', '/images/malls/mall-of-qatar.jpg', 'Al Rayyan'],
            ['festival-city', 'Doha Festival City', 'Retail, dining, and entertainment in one stop — timed transfers from hotel or Hamad Airport.', '/images/malls/festival-city.jpg', 'Umm Salal'],
            ['villaggio', 'Villaggio Mall', 'Al Waab classic — Venetian canals, boutiques, and easy curb-side pickup when you’re done.', '/images/malls/villaggio.jpg', 'Al Waab'],
            ['lagoona', 'Lagoona Mall', 'West Bay Lagoon shopping — short hops from nearby hotels and the Corniche.', '/images/malls/lagoona.jpg', 'West Bay Lagoon'],
            ['landmark', 'Landmark Mall', 'Al Gharrafa favourite for everyday shopping — reliable drop-off and wait options.', '/images/malls/landmark.jpg', 'Al Gharrafa'],
            ['city-center', 'City Center Doha', 'West Bay convenience — mall, cinema, and dining linked to your hotel by chauffeur.', '/images/malls/city-center.jpg', 'West Bay'],
            ['souq-waqif', 'Souq Waqif', 'Old Doha’s shopping lanes — door-to-door so you skip circling for a spot.', '/images/malls/souq.jpg', 'Old Doha'],
        ];
        foreach ($mallCards as $i => [$slug, $title, $body, $img, $area]) {
            $rows[] = $this->card('mall', $slug, $title, $body, $img, $area, $i);
        }
        foreach ([
            ['msheireb', 'Msheireb Downtown', 'Doha'],
            ['ezdan', 'Ezdan Mall', 'Al Gharafa'],
        ] as $i => [$slug, $label, $area]) {
            $rows[] = $this->schedulerOnly('mall', $slug, $label, $area, 100 + $i);
        }

        // ——— Restaurants ———
        $restaurantCards = [
            ['balhambar', 'Balhambar', 'Corniche views and Gulf cuisine — curb-side drop-off before your table.', '/images/restaurants/balhambar.jpg', 'Corniche'],
            ['souq-dining', 'Souq Waqif dining', 'Cafés and traditional restaurants — walk in without hunting for parking.', '/images/restaurants/souq-cafe.jpg', 'Old Doha'],
            ['hotel-fine-dining', 'Hotel fine dining', 'Nobu, Hakkasan, Market by Jean-Georges — lobby to entrance, on time.', '/images/restaurants/mandarin.jpg', 'Hotels'],
            ['west-bay-lunch', 'Business lunch, West Bay', 'Tower-to-restaurant runs with a waiting chauffeur for the return.', '/images/restaurants/westbay.jpg', 'West Bay'],
            ['katara-evenings', 'Katara evenings', 'Cultural Village terraces — hotel pickup and a calm ride home.', '/images/restaurants/katara.jpg', 'Katara'],
            ['msheireb-downtown', 'Msheireb Downtown', 'Contemporary dining clusters — drop at the door, skip the garage.', '/images/restaurants/msheireb.jpg', 'Msheireb'],
            ['pearl-waterfront', 'Pearl waterfront', 'Porto Arabia and marina tables — chauffeured arrival for guests and clients.', '/images/restaurants/dining1.jpg', 'The Pearl'],
            ['souq-nights', 'Souq nights', 'Evening markets and rooftop spots — punctual pickup when dessert ends.', '/images/restaurants/souq-night.jpg', 'Old Doha'],
        ];
        foreach ($restaurantCards as $i => [$slug, $title, $body, $img, $area]) {
            $rows[] = $this->card('restaurant', $slug, $title, $body, $img, $area, $i);
        }
        foreach ([
            ['idam', 'IDAM by Alain Ducasse', 'Museum of Islamic Art'],
            ['alba', 'ALBA – Raffles Doha', 'Raffles Doha'],
            ['jamavar', 'Jamavar Doha', 'Doha'],
            ['nobu', 'Nobu Doha', 'Four Seasons West Bay'],
            ['la-mar', 'La Mar Doha by Gastón Acurio', 'Doha'],
            ['gaia', 'Gaia Doha', 'Doha'],
            ['reberu', 'REBERU Contemporary Cuisine', 'Doha'],
            ['sora', 'Sora Rooftop', 'Doha'],
            ['teatro', 'Teatro Doha', 'Doha'],
            ['morimoto', 'Morimoto Doha', 'Doha'],
            ['hakkasan', 'Hakkasan Doha', 'The St. Regis'],
            ['la-spiga', 'La Spiga by Papermoon', 'Doha'],
            ['saffron', 'Saffron Doha', 'Doha'],
            ['jiwan', 'Jiwan', 'National Museum of Qatar'],
            ['izu', 'IZU at Mandarin Oriental', 'Mandarin Oriental'],
        ] as $i => [$slug, $label, $area]) {
            $rows[] = $this->schedulerOnly('restaurant', $slug, $label, $area, 100 + $i);
        }

        // ——— Iconic ———
        $iconicCards = [
            ['mia', 'Museum of Islamic Art', 'I.M. Pei’s masterpiece on the Corniche — arrive with time to spare and leave the logistics to your chauffeur.', '/images/iconic-places/mia-flickr2.jpg', 'Doha Corniche'],
            ['souq-waqif', 'Souq Waqif', 'Narrow lanes, spice stalls, and evening energy. Door-to-door drop-off at the heart of old Doha.', '/images/iconic-places/souq.jpg', 'Old Doha'],
            ['katara', 'Katara Cultural Village', 'Amphitheatre, galleries, and waterfront dining — a calm transfer for a full cultural afternoon.', '/images/iconic-places/katara.jpg', 'West Bay Lagoon'],
            ['pearl', 'The Pearl Qatar', 'Marina promenades and boutique streets. Ideal for shopping stops or a sunset stroll.', '/images/iconic-places/pearl-marina.jpg', 'West Bay'],
            ['nmoq', 'National Museum of Qatar', 'Jean Nouvel’s desert rose — punctual Meet & Greet so your visit starts on schedule.', '/images/iconic-places/nmoq.jpg', 'Doha'],
            ['corniche', 'Doha Corniche', 'Skyline views along the waterfront. Perfect as a scenic link between hotels and landmarks.', '/images/iconic-places/corniche.jpg', 'Doha Waterfront'],
            ['lusail', 'Lusail', 'Boulevard, marina, and stadium district — modern Qatar, chauffeured end to end.', '/images/iconic-places/lusail.jpg', 'Lusail'],
            ['education-city', 'Education City', 'Campuses and museums in Al Rayyan. Reliable transfers for visitors and conferences.', '/images/iconic-places/education-mosque.jpg', 'Al Rayyan'],
        ];
        foreach ($iconicCards as $i => [$slug, $title, $body, $img, $area]) {
            $rows[] = $this->card('iconic', $slug, $title, $body, $img, $area, $i);
        }
        foreach ([
            ['mina-district', 'Mina District', 'Old Doha Port'],
            ['khor-al-adaid', 'Khor Al Adaid (Inland Sea)', 'Southeast Qatar'],
            ['sealine', 'Sealine Beach', 'Mesaieed'],
            ['banana-island', 'Banana Island', 'Off Doha'],
            ['al-safliya', 'Al Safliya Island', 'Off Doha'],
            ['purple-island', 'Purple Island', 'Al Khor'],
            ['al-zubarah', 'Al Zubarah Fort', 'Northwest Qatar'],
            ['east-west', "Richard Serra's East-West/West-East", 'Brouq Nature Reserve'],
            ['barzan-towers', 'Barzan Towers', 'Umm Salal'],
            ['imam-abdul-wahhab', 'Imam Abdul Wahhab Mosque', 'Al Bidda'],
            ['aspire-park', 'Aspire Park', 'Al Waab'],
            ['oxygen-park', 'Oxygen Park', 'Education City'],
            ['al-bidda-park', 'Al Bidda Park', 'Corniche'],
        ] as $i => [$slug, $label, $area]) {
            $rows[] = $this->schedulerOnly('iconic', $slug, $label, $area, 100 + $i);
        }

        return $rows;
    }

    /**
     * @return array<string, mixed>
     */
    private function card(string $category, string $slug, string $title, string $body, string $img, string $area, int $sort): array
    {
        return [
            'category' => $category,
            'slug' => $slug ?: Str::slug($title),
            'title' => $title,
            'body' => $body,
            'image_path' => $img,
            'label' => $title,
            'area' => $area,
            'show_in_carousel' => true,
            'show_in_scheduler' => true,
            'sort_order' => $sort,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function schedulerOnly(string $category, string $slug, string $label, string $area, int $sort): array
    {
        return [
            'category' => $category,
            'slug' => $slug,
            'title' => $label,
            'body' => null,
            'image_path' => null,
            'label' => $label,
            'area' => $area,
            'show_in_carousel' => false,
            'show_in_scheduler' => true,
            'sort_order' => $sort,
        ];
    }
}
