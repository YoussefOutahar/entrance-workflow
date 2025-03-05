# Visitor Pass Workflow System - Testing Guide

This guide provides step-by-step instructions for testing the complete visitor pass workflow system.

## System Overview

The visitor pass system implements a multi-stage approval workflow:

1. **Creation** - Department users create visitor pass requests
2. **Chef Approval** - Department supervisors approve the initial request
3. **Service des Permis Review** - Service des Permis reviews the approved request
4. **Final Approval** - Barrière or Gendarmerie gives final approval

## Setup Instructions

1. Run migrations and seeders:

    php artisan migrate:fresh --seed

2. This will create all necessary users, roles, groups, and permissions required for testing.

## User Accounts

### Workflow-Specific Test Users

| Role               | Email                        | Password        | Description                                   |
| ------------------ | ---------------------------- | --------------- | --------------------------------------------- |
| Admin              | admin@example.com            | admin123        | System administrator with full access         |
| Department User    | user.informatique@system.com | User123!        | Regular department user who can create passes |
| Chef               | chef.informatique@system.com | Chef123!        | Department supervisor who can approve passes  |
| Service des Permis | spp@system.com               | SPP123!         | Service des Permis reviewer                   |
| Barrière           | barriere@system.com          | Barriere123!    | Barrière approver for final approval          |
| Gendarmerie        | gendarmerie@system.com       | Gendarmerie123! | Gendarmerie approver for final approval       |

### Department Users

Each department has a regular user and a chef/supervisor:

| Department          | Regular User                   | Chef/Supervisor                |
| ------------------- | ------------------------------ | ------------------------------ |
| Administration      | user.administration@system.com | chef.administration@system.com |
| Finances            | user.finances@system.com       | chef.finances@system.com       |
| Logistique          | user.logistique@system.com     | chef.logistique@system.com     |
| Ressources Humaines | user.rh@system.com             | chef.rh@system.com             |
| Informatique        | user.informatique@system.com   | chef.informatique@system.com   |
| Operations          | user.operations@system.com     | chef.operations@system.com     |
| Laboratoire         | user.laboratoire@system.com    | chef.laboratoire@system.com    |
| Sécurité            | user.securite@system.com       | chef.securite@system.com       |
| Maintenance         | user.maintenance@system.com    | chef.maintenance@system.com    |
| Formation           | user.formation@system.com      | chef.formation@system.com      |
| Communication       | user.communication@system.com  | chef.communication@system.com  |
| Juridique           | user.juridique@system.com      | chef.juridique@system.com      |
| Qualité             | user.qualite@system.com        | chef.qualite@system.com        |

_All regular users have password "User123!" and all chefs have password "Chef123!"_

## Testing the Complete Workflow

### 1. Create a Visitor Pass

1. **Login as a department user**:

    Email: user.informatique@system.com
    Password: User123!

2. **Create a new visitor pass**:

-   Fill in the required details:
    -   Visitor Name
    -   ID Number
    -   Visit Date
    -   Visited Person
    -   Unit
    -   Module
    -   Visit Purpose
    -   Duration
    -   Category (S-T, Ch, E)
-   Submit the form

3. **Check the status**:

-   Status should be "awaiting"
-   The pass is now waiting for chef approval

### 2. Chef Approval

1. **Login as a department chef**:

    Email: chef.informatique@system.com
    Password: Chef123!

2. **View the pending visitor pass**:

-   Find the visitor pass created in the previous step
-   Check the status is "awaiting"

3. **Approve the pass**:

-   Use the action button to submit the pass for approval
-   Optionally add approval notes
-   Submit the approval

4. **Check the updated status**:

-   Status should change to "pending_chef" then to "started"
-   The pass is now submitted to Service des Permis for review

### 3. Service des Permis Review

1. **Login as Service des Permis**:

    Email: spp@system.com
    Password: SPP123!

2. **View the pending visitor pass**:

-   Find the visitor pass in the list
-   Check the status is "started"

3. **Review the pass**:

-   Use the action button to mark as reviewed
-   Optionally add review notes
-   Submit the review

4. **Check the updated status**:

-   Status should change to "in_progress"
-   The pass is now ready for final approval

### 4. Final Approval by Barrière/Gendarmerie

1. **Login as Barrière**:

    Email: barriere@system.com
    Password: Barriere123!

    _Alternatively, you can log in as Gendarmerie (gendarmerie@system.com / Gendarmerie123!)_

2. **View the pending visitor pass**:

-   Find the visitor pass in the list
-   Check the status is "in_progress"

3. **Give final approval**:

-   Use the action button to approve the pass
-   Optionally add approval notes
-   Submit the final approval

4. **Check the updated status**:

-   Status should change to "accepted"
-   The visitor pass is now fully approved

### 5. Testing Rejection

At any point in the workflow, a user with appropriate permissions can reject a pass:

1. **Login as a chef or workflow approver**
2. **View the visitor pass in process**
3. **Reject the pass**:

-   Use the reject action
-   Provide a reason for rejection
-   Submit the rejection

4. **Status should change to "declined"**

## Testing Special Cases

### Admin Override

1. **Login as admin**:

    Email: admin@example.com
    Password: admin123

2. **View any visitor pass**

3. **Admin can perform any action**:

-   Bypass normal workflow
-   Directly approve or reject passes
-   Change pass status to any allowed state

### Multi-Group User

1. **Login as multi-group user**:

    Email: multi.group@system.com
    Password: User123!

2. **Create a visitor pass**:

-   The user belongs to both Informatique and RH groups
-   Check if the user can see passes from both groups

### Multi-Role User

1. **Login as multi-role user**:

    Email: multi.role@system.com
    Password: User123!

2. **Test role-specific actions**:

-   The user has both 'user' and 'chef' roles
-   Test if the user can perform chef approval actions

## Workflow Status Transitions

Valid status transitions in the workflow:

-   **awaiting → pending_chef**: Initial submission to chef
-   **pending_chef → started**: Chef approval sends to Service des Permis
-   **started → in_progress**: Service des Permis review complete
-   **in_progress → accepted**: Final approval by Barrière/Gendarmerie
-   **Any stage → declined**: Rejection
-   **declined/accepted → awaiting**: Reopening a pass

## API Testing

If you need to test the workflow via API, use the following endpoints:

1. **Create Pass**: POST `/api/visitor-passes`
2. **View Pass**: GET `/api/visitor-passes/{id}`
3. **Update Status**: POST `/api/visitor-passes/{id}/status`

-   Include `status` and optional `notes` in request body

## Verifying Activity Logs

Each action in the workflow creates an activity log entry:

1. **Login to the system**
2. **View a visitor pass**
3. **Check the Activity tab**:

-   Each status change is recorded
-   User who performed the action
-   Timestamp of the action
-   Notes provided during the approval/rejection

## Troubleshooting

-   **Permission Issues**: Verify user belongs to the correct group and has the right role
-   **Workflow Transition Errors**: Make sure you're following the correct sequence of status changes
-   **Missing Approver**: Check if the required approver user exists and has the correct permissions

## Conclusion

This testing guide should help you verify all aspects of the visitor pass workflow system. The seeded data provides a comprehensive set of users and groups to test each stage of the approval process.
