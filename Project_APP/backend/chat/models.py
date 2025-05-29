from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=200, default="Nouvelle conversation")
    
    def __str__(self):
        return f"Conversation de {self.user.username} - {self.title}"

class ChatMessage(models.Model):
    conversation = models.ForeignKey(ChatConversation, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    is_user = models.BooleanField(default=True)  # True si message de l'utilisateur, False si réponse du bot
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"Message de {self.conversation.user.username}: {self.content[:50]}..."


