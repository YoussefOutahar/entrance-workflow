<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVisitorPassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'visit_date' => 'sometimes|date',
            'visited_person' => 'sometimes|string',
            'unit' => 'sometimes|string',
            'module' => 'sometimes|string',
            'visit_purpose' => 'sometimes|string',
            'duration_type' => 'sometimes|in:full_day,custom',
            'duration_days' => 'sometimes|integer|max:5',
            'visitor_name' => 'sometimes|string',
            'id_number' => 'sometimes|string',
            'organization' => 'nullable|string',
            'category' => 'sometimes|in:S-T,Ch,E',
            'files.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
        ];
    }
}
