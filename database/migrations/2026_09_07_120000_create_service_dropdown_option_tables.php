<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('service_duration_options')) {
            Schema::create('service_duration_options', function (Blueprint $table) {
                $table->id();
                $table->foreignId('service_type_id')->constrained()->cascadeOnDelete();
                $table->string('value');
                $table->string('label');
                $table->unsignedInteger('duration_minutes')->nullable();
                $table->unsignedInteger('sort_order')->default(0);
                $table->string('status')->default('active');
                $table->timestamps();

                $table->unique(['service_type_id', 'value'], 'svc_duration_opts_unique');
                $table->index(['service_type_id', 'status', 'sort_order'], 'svc_duration_opts_idx');
            });
        }

        if (! Schema::hasTable('service_count_options')) {
            Schema::create('service_count_options', function (Blueprint $table) {
                $table->id();
                $table->foreignId('service_type_id')->constrained()->cascadeOnDelete();
                $table->string('kind'); // passenger | student
                $table->string('value');
                $table->string('label');
                $table->unsignedInteger('sort_order')->default(0);
                $table->string('status')->default('active');
                $table->timestamps();

                $table->unique(['service_type_id', 'kind', 'value'], 'svc_count_opts_unique');
                $table->index(['service_type_id', 'kind', 'status'], 'svc_count_opts_idx');
            });
        }

        if (! Schema::hasTable('school_terms')) {
            Schema::create('school_terms', function (Blueprint $table) {
                $table->id();
                $table->string('value')->unique();
                $table->string('label');
                $table->unsignedInteger('sort_order')->default(0);
                $table->string('status')->default('active');
                $table->timestamps();

                $table->index(['status', 'sort_order'], 'school_terms_status_idx');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('school_terms');
        Schema::dropIfExists('service_count_options');
        Schema::dropIfExists('service_duration_options');
    }
};
