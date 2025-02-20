<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    protected $fillable = [
        'visitor_pass_id',
        'name',
        'path',
        'type',
        'size'
    ];

    public function visitorPass(): BelongsTo
    {
        return $this->belongsTo(VisitorPass::class);
    }
}
