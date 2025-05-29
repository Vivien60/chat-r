Ajouter un controller Message.
Il va :
sauvegarder les nouveaux messages quand ils sont soumis
envoyer une notification aux participants.

C'est le step 1.

Ensuite, step 2 : 
Implémenter. Récupérer en dur mes infos via window.chat.messagingService.subscription.toJSON(), les mettre dans un .env que je ne committerai pas évidemment. 
Attention au fait que je vais coupler avec WebPush, penser à découpler pour le passage aux web-sockets... ou à d'autres !

Pour l'instant, n'implémenter aucune sauvegarde. Pour l'envoi de notif, passer par https://github.com/web-push-libs
