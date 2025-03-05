<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class VisitorPassValidationReport extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @var array
     */
    protected $stats;

    /**
     * Create a new notification instance.
     */
    public function __construct(array $stats)
    {
        $this->stats = $stats;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $today = Carbon::today()->format('Y-m-d');

        $mail = (new MailMessage)
            ->subject("Visitor Pass Validation Report - {$today}")
            ->greeting("Daily Visitor Pass Validation")
            ->line("The system has validated visitor passes for {$today}.")
            ->line("Total passes checked: {$this->stats['total_checked']}")
            ->line("Successfully validated: {$this->stats['validated']}")
            ->line("Errors encountered: {$this->stats['errors']}");

        if (isset($this->stats['message'])) {
            $mail->line("Error details: {$this->stats['message']}");
        }

        return $mail;
    }
}
