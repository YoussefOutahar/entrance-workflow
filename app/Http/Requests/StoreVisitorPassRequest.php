<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVisitorPassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'visit_date' => 'required|date',
            'visited_person' => 'required|string',
            'unit' => 'required|string',
            'module' => 'required|string',
            'visit_purpose' => 'required|string',
            'duration_type' => 'required|in:full_day,custom',
            'duration_days' => 'required_if:duration_type,custom|integer|max:5',
            'visitor_name' => 'required|string',
            'id_number' => 'required|string',
            'organization' => 'nullable|string',
            'category' => 'required|in:S-T,Ch,E',
            'files.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
        ];
    }
}
