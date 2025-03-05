# Système de Workflow des Laissez-passer Visiteurs - Guide de Test

Ce guide fournit des instructions étape par étape pour tester le système complet de workflow des laissez-passer visiteurs.

## Aperçu du Système

Le système de laissez-passer implémente un workflow d'approbation à plusieurs étapes:

1. **Création** - Les utilisateurs des départements créent des demandes de laissez-passer
2. **Approbation du Chef** - Les superviseurs de département approuvent la demande initiale
3. **Révision du Service des Permis** - Le Service des Permis examine la demande approuvée
4. **Approbation Finale** - La Barrière ou la Gendarmerie donne l'approbation finale

## Instructions d'Installation

1. Exécutez les migrations et les seeders:
   php artisan migrate:fresh --seed
   Copy
2. Cela créera tous les utilisateurs, rôles, groupes et permissions nécessaires pour les tests.

## Comptes Utilisateurs

### Utilisateurs de Test Spécifiques au Workflow

| Rôle                    | Email                        | Mot de passe    | Description                                                     |
| ----------------------- | ---------------------------- | --------------- | --------------------------------------------------------------- |
| Admin                   | admin@example.com            | admin123        | Administrateur système avec accès complet                       |
| Utilisateur Département | user.informatique@system.com | User123!        | Utilisateur régulier pouvant créer des laissez-passer           |
| Chef                    | chef.informatique@system.com | Chef123!        | Superviseur de département pouvant approuver les laissez-passer |
| Service des Permis      | spp@system.com               | SPP123!         | Réviseur du Service des Permis                                  |
| Barrière                | barriere@system.com          | Barriere123!    | Approbateur de la Barrière pour l'approbation finale            |
| Gendarmerie             | gendarmerie@system.com       | Gendarmerie123! | Approbateur de la Gendarmerie pour l'approbation finale         |

### Utilisateurs des Départements

Chaque département dispose d'un utilisateur régulier et d'un chef/superviseur:

| Département         | Utilisateur Régulier           | Chef/Superviseur               |
| ------------------- | ------------------------------ | ------------------------------ |
| Administration      | user.administration@system.com | chef.administration@system.com |
| Finances            | user.finances@system.com       | chef.finances@system.com       |
| Logistique          | user.logistique@system.com     | chef.logistique@system.com     |
| Ressources Humaines | user.rh@system.com             | chef.rh@system.com             |
| Informatique        | user.informatique@system.com   | chef.informatique@system.com   |
| Opérations          | user.operations@system.com     | chef.operations@system.com     |
| Laboratoire         | user.laboratoire@system.com    | chef.laboratoire@system.com    |
| Sécurité            | user.securite@system.com       | chef.securite@system.com       |
| Maintenance         | user.maintenance@system.com    | chef.maintenance@system.com    |
| Formation           | user.formation@system.com      | chef.formation@system.com      |
| Communication       | user.communication@system.com  | chef.communication@system.com  |
| Juridique           | user.juridique@system.com      | chef.juridique@system.com      |
| Qualité             | user.qualite@system.com        | chef.qualite@system.com        |

_Tous les utilisateurs réguliers ont le mot de passe "User123!" et tous les chefs ont le mot de passe "Chef123!"_

## Test du Workflow Complet

### 1. Créer un Laissez-passer Visiteur

1. **Connectez-vous en tant qu'utilisateur de département**:
   Email: user.informatique@system.com
   Mot de passe: User123!
   Copy
2. **Créez un nouveau laissez-passer visiteur**:

-   Remplissez les détails requis:
    -   Nom du Visiteur
    -   Numéro d'Identification
    -   Date de Visite
    -   Personne Visitée
    -   Unité
    -   Module
    -   Motif de la Visite
    -   Durée
    -   Catégorie (S-T, Ch, E)
-   Soumettez le formulaire

3. **Vérifiez le statut**:

-   Le statut devrait être "awaiting" (en attente)
-   Le laissez-passer attend maintenant l'approbation du chef

### 2. Approbation du Chef

1. **Connectez-vous en tant que chef de département**:
   Email: chef.informatique@system.com
   Mot de passe: Chef123!
   Copy
2. **Consultez le laissez-passer en attente**:

-   Trouvez le laissez-passer créé à l'étape précédente
-   Vérifiez que le statut est "awaiting" (en attente)

3. **Approuvez le laissez-passer**:

-   Utilisez le bouton d'action pour soumettre le laissez-passer pour approbation
-   Ajoutez éventuellement des notes d'approbation
-   Soumettez l'approbation

4. **Vérifiez le statut mis à jour**:

-   Le statut devrait passer à "pending_chef" puis à "started"
-   Le laissez-passer est maintenant soumis au Service des Permis pour révision

### 3. Révision par le Service des Permis

1. **Connectez-vous en tant que Service des Permis**:
   Email: spp@system.com
   Mot de passe: SPP123!
   Copy
2. **Consultez le laissez-passer en attente**:

-   Trouvez le laissez-passer dans la liste
-   Vérifiez que le statut est "started" (démarré)

3. **Révisez le laissez-passer**:

-   Utilisez le bouton d'action pour marquer comme révisé
-   Ajoutez éventuellement des notes de révision
-   Soumettez la révision

4. **Vérifiez le statut mis à jour**:

-   Le statut devrait passer à "in_progress" (en cours)
-   Le laissez-passer est maintenant prêt pour l'approbation finale

### 4. Approbation Finale par la Barrière/Gendarmerie

1. **Connectez-vous en tant que Barrière**:
   Email: barriere@system.com
   Mot de passe: Barriere123!
   Copy
   _Alternativement, vous pouvez vous connecter en tant que Gendarmerie (gendarmerie@system.com / Gendarmerie123!)_

2. **Consultez le laissez-passer en attente**:

-   Trouvez le laissez-passer dans la liste
-   Vérifiez que le statut est "in_progress" (en cours)

3. **Donnez l'approbation finale**:

-   Utilisez le bouton d'action pour approuver le laissez-passer
-   Ajoutez éventuellement des notes d'approbation
-   Soumettez l'approbation finale

4. **Vérifiez le statut mis à jour**:

-   Le statut devrait passer à "accepted" (accepté)
-   Le laissez-passer visiteur est maintenant entièrement approuvé

### 5. Test de Rejet

À n'importe quelle étape du workflow, un utilisateur avec les permissions appropriées peut rejeter un laissez-passer:

1. **Connectez-vous en tant que chef ou approbateur dans le workflow**
2. **Consultez le laissez-passer en cours de traitement**
3. **Rejetez le laissez-passer**:

-   Utilisez l'action de rejet
-   Fournissez une raison pour le rejet
-   Soumettez le rejet

4. **Le statut devrait passer à "declined" (refusé)**

## Test des Cas Spéciaux

### Dérogation d'Administrateur

1. **Connectez-vous en tant qu'admin**:
   Email: admin@example.com
   Mot de passe: admin123
   Copy
2. **Consultez n'importe quel laissez-passer visiteur**

3. **L'administrateur peut effectuer n'importe quelle action**:

-   Contourner le workflow normal
-   Approuver ou rejeter directement les laissez-passer
-   Changer le statut du laissez-passer à n'importe quel état autorisé

### Utilisateur Multi-Groupes

1. **Connectez-vous en tant qu'utilisateur multi-groupes**:
   Email: multi.group@system.com
   Mot de passe: User123!
   Copy
2. **Créez un laissez-passer visiteur**:

-   L'utilisateur appartient aux groupes Informatique et RH
-   Vérifiez si l'utilisateur peut voir les laissez-passer des deux groupes

### Utilisateur Multi-Rôles

1. **Connectez-vous en tant qu'utilisateur multi-rôles**:
   Email: multi.role@system.com
   Mot de passe: User123!
   Copy
2. **Testez les actions spécifiques aux rôles**:

-   L'utilisateur a les rôles 'user' et 'chef'
-   Vérifiez si l'utilisateur peut effectuer des actions d'approbation de chef

## Transitions d'État dans le Workflow

Transitions d'état valides dans le workflow:

-   **awaiting → pending_chef**: Soumission initiale au chef
-   **pending_chef → started**: L'approbation du chef envoie au Service des Permis
-   **started → in_progress**: Révision du Service des Permis terminée
-   **in_progress → accepted**: Approbation finale par la Barrière/Gendarmerie
-   **N'importe quelle étape → declined**: Rejet
-   **declined/accepted → awaiting**: Réouverture d'un laissez-passer

## Test de l'API

Si vous devez tester le workflow via API, utilisez les endpoints suivants:

1. **Créer un Laissez-passer**: POST `/api/visitor-passes`
2. **Voir un Laissez-passer**: GET `/api/visitor-passes/{id}`
3. **Mettre à jour le Statut**: POST `/api/visitor-passes/{id}/status`

-   Incluez `status` et `notes` optionnelles dans le corps de la requête

## Vérification des Journaux d'Activité

Chaque action dans le workflow crée une entrée dans le journal d'activité:

1. **Connectez-vous au système**
2. **Consultez un laissez-passer visiteur**
3. **Vérifiez l'onglet Activité**:

-   Chaque changement de statut est enregistré
-   L'utilisateur qui a effectué l'action
-   L'horodatage de l'action
-   Les notes fournies lors de l'approbation/rejet

## Validation Automatique des Laissez-passer

Le système inclut une tâche CRON automatisée qui valide les laissez-passer visiteurs à leur date de visite prévue:

### Fonctionnement

1. Une commande programmée `visitor-passes:validate` s'exécute quotidiennement à 6h00
2. Elle identifie tous les laissez-passer approuvés dont la date de visite correspond au jour actuel
3. Chaque laissez-passer est automatiquement validé et enregistré dans le journal d'activité
4. Les administrateurs système reçoivent une notification avec les statistiques de validation

### Test du Processus de Validation

Pour tester manuellement le processus de validation:

```bash
# Exécuter la validation sans notifications
php artisan visitor-passes:validate

# Exécuter la validation avec notifications aux administrateurs
php artisan visitor-passes:validate --notify
Le processus de validation va:

Trouver tous les laissez-passer avec la date d'aujourd'hui qui sont au statut "accepted"
Ajouter une entrée d'activité pour chaque laissez-passer indiquant qu'il a été validé
Générer des statistiques sur le nombre de laissez-passer validés

Configuration du Serveur
Pour que la validation s'exécute automatiquement, assurez-vous que votre serveur a le planificateur Laravel configuré:
bashCopy* * * * * cd /chemin-vers-votre-projet && php artisan schedule:run >> /dev/null 2>&1

## Dépannage

-   **Problèmes de Permission**: Vérifiez que l'utilisateur appartient au bon groupe et a le rôle approprié
-   **Erreurs de Transition de Workflow**: Assurez-vous que vous suivez la séquence correcte de changements de statut
-   **Approbateur Manquant**: Vérifiez si l'approbateur requis existe et a les permissions correctes

## Conclusion

Ce guide de test devrait vous aider à vérifier tous les aspects du système de workflow des laissez-passer visiteurs. Les données préchargées fournissent un ensemble complet d'utilisateurs et de groupes pour tester chaque étape du processus d'approbation.
```
