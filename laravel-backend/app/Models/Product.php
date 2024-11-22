<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Product extends Model
{
    use HasFactory, HasApiTokens;
    //

    protected $primaryKey = 'barcode';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'barcode',
        'name',
        'description',
        'price',
        'quantity',
        'category',
    ];
}
