<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('explore_places', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // hotel | beach | mall | restaurant | iconic
            $table->string('slug');
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('image_path')->nullable();
            $table->string('label');
            $table->string('area')->nullable();
            $table->string('formatted_address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('place_id')->nullable();
            $table->string('provider')->nullable();
            $table->boolean('show_in_carousel')->default(true);
            $table->boolean('show_in_scheduler')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['category', 'slug']);
            $table->index(['category', 'status', 'sort_order'], 'explore_places_cat_status_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('explore_places');
    }
};
