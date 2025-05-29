from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.utils.decorators import method_decorator
import json
import requests
from .models import ChatConversation, ChatMessage
from App_Users.models import App_User, Department, Service
from Materiels.models import Materiel
from huggingface_hub import InferenceClient

class ChatService:
    @staticmethod
    def get_huggingface_response(message):
        """Utilise l'API Hugging Face avec InferenceClient et le modèle DeepSeek-R1"""
        try:
            
            # Initialisez le client avec votre token
            client = InferenceClient(
                provider="nebius",
                api_key="token",  # Remplacez par votre vrai token
            )
            
            # Créer la completion avec le nouveau modèle
            completion = client.chat.completions.create(
                model="meta-llama/Llama-3.1-8B-Instruct",
                messages=[
                    {
                        "role": "user",
                        "content": message
                    }
                ],
            )
            
            # Extraire la réponse
            if completion.choices and len(completion.choices) > 0:
                response_content = completion.choices[0].message.content
                return response_content if response_content else "Je suis là pour vous aider avec vos questions."
            
            return "Je suis désolé, je ne peux pas répondre à cette question pour le moment."
            
        except Exception as e:
            print(f"Erreur lors de l'appel à l'API: {e}")  # Pour le debugging
            return "Erreur de connexion avec le service de chat."
    
    @staticmethod
    def get_company_info():
        """Récupère les informations de l'entreprise depuis la DB"""
        try:
            departments = Department.objects.all()
            if not departments.exists():
                return "Aucun département n'est configuré dans le système."
            
            info = "📋 **Informations sur l'entreprise:**\n\n"
            
            for dept in departments:
                info += f"🏢 **Département:** {dept.name}\n"
                services = Service.objects.filter(department=dept)
                if services.exists():
                    for service in services:
                        info += f"   • **Service:** {service.name}"
                        if service.description:
                            info += f" - {service.description}"
                        info += "\n"
                else:
                    info += "   • Aucun service configuré\n"
                info += "\n"
            
            return info
        except Exception as e:
            return "Erreur lors de la récupération des informations de l'entreprise."
    
    @staticmethod
    def help_create_ticket():
        """Aide à créer un ticket"""
        return """
🎫 **Aide pour créer un ticket:**

**Informations requises:**
1. **Titre** - Résumé du problème
2. **Description** - Détails du problème
3. **Catégorie:**
   • Problème Réseau
   • Problème Matériel  
   • Problème Logiciel
   • Problème de Sécurité
   • Problème de Compte
   • Autre

4. **Priorité:** Faible, Moyenne, Haute, Critique
5. **Type:** Incident, Demande, Maintenance

**💡 Exemple:**
"Mon ordinateur ne démarre plus depuis ce matin, c'est urgent pour mon travail"

➡️ Utilisez le formulaire de création de ticket sur votre interface pour soumettre votre demande.
        """
    
    @staticmethod
    def suggest_solution(problem_description):
        """Suggère des solutions pour les problèmes matériels"""
        problem_lower = problem_description.lower()
        
        solutions = {
            'ordinateur': [
                "🔌 Vérifiez que l'ordinateur est bien branché",
                "⚡ Maintenez le bouton d'alimentation 10 secondes",
                "🔗 Contrôlez toutes les connexions de câbles",
                "🔄 Tentez un redémarrage"
            ],
            'imprimante': [
                "💡 Vérifiez que l'imprimante est allumée",
                "🖨️ Contrôlez le niveau d'encre/toner",
                "🔌 Vérifiez la connexion USB ou réseau",
                "🔄 Redémarrez l'imprimante"
            ],
            'écran': [
                "🔗 Vérifiez les câbles de connexion",
                "🔄 Testez avec un autre câble",
                "💡 Vérifiez que l'écran est allumé",
                "🔆 Ajustez la luminosité"
            ],
            'réseau': [
                "🌐 Testez votre connexion internet",
                "🔄 Redémarrez votre routeur/box",
                "🔗 Vérifiez les câbles réseau",
                "👨‍💻 Contactez l'administrateur réseau"
            ],
            'internet': [
                "🌐 Testez votre connexion internet",
                "🔄 Redémarrez votre routeur/box",
                "🔗 Vérifiez les câbles réseau",
                "👨‍💻 Contactez l'administrateur réseau"
            ],
            'lent': [
                "🔄 Redémarrez votre ordinateur",
                "💾 Vérifiez l'espace disque disponible",
                "🛡️ Lancez un scan antivirus",
                "📊 Vérifiez les programmes en arrière-plan"
            ]
        }
        
        suggestions = []
        for keyword, sols in solutions.items():
            if keyword in problem_lower:
                suggestions.extend(sols)
        
        if suggestions:
            return "🔧 **Solutions à essayer:**\n\n" + "\n".join(suggestions[:4]) + "\n\n⚠️ Si le problème persiste, créez un ticket pour qu'un technicien vous aide."
        else:
            return "🎫 Pour ce type de problème, je recommande de créer un ticket pour qu'un technicien puisse vous aider rapidement."

    @staticmethod
    def get_general_company_info():
        return """
                    🏢 **Nom de l'entreprise :** CASA TECHNIQUE ENVIRONNEMENT  
                    👨‍💼 **Gérant :** M. Saïd MABROUK  
                    ⚖️ **Forme juridique :** S.A.R.L  
                    📍 **Siège social :** 248, lot Lina - Sidi Maarouf - Casablanca  
                    🌐 **Site web :** www.casatechnique.ma  
                    📞 **Téléphones :** 05 22 58 63 10 / 05 22 58 63 15  
                    📠 **Fax :** 05 22 58 10 36  

                    📝 **Présentation :**  
                    Depuis presque un quart de siècle, CASA TECHNIQUE ENVIRONNEMENT innove dans le domaine de l’environnement, au service des communes, institutions privées et industrielles.  
                    Plus de **3500 agents** assurent la propreté de **30 villes**, avec une expertise dans la collecte, le tri, le transport, la valorisation des déchets, et la salubrité publique.  
                    À l’écoute des spécificités locales, l’entreprise propose des solutions personnalisées, durables et à forte technicité.
                            """

    @staticmethod
    def process_message(message):
        """Traite le message et génère une réponse appropriée"""
        message_lower = message.lower()
        
        # Mots-clés pour identifier le type de demande
        if any(word in message_lower for word in ['département', 'service','organisation', 'departement']):
            return ChatService.get_company_info()
        
        elif any(word in message_lower for word in ['ticket', 'créer', 'aide ticket', 'comment créer', 'creer']):
            return ChatService.help_create_ticket()
        
        elif any(word in message_lower for word in ['solution', 'réparer', 'panne', 'problème', 'défaut', 'marche pas', 'fonctionne pas', 'lent']):
            return ChatService.suggest_solution(message)
        elif any(word in message_lower for word in ['casatechnique', 'casa technique', 'entreprise','nom entreprise', 'gérant', 'adresse', 'téléphone', 'contact', 'présentation', 'site web', 'qui êtes-vous', 'qui est casatechnique']):
            return ChatService.get_general_company_info()

        
        else:
            # Question générale - utiliser Hugging Face
            return ChatService.get_huggingface_response(message)

@method_decorator(csrf_exempt, name='dispatch')
class ChatView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            message = data.get('message', '').strip()
            user_id = data.get('user_id')
            
            if not message:
                return JsonResponse({'error': 'Message vide'}, status=400)
            
            # Récupérer ou créer une conversation
            user = None
            conversation = None
            
            if user_id:
                try:
                    user = App_User.objects.get(id=user_id)
                    conversation, created = ChatConversation.objects.get_or_create(
                        user=user,
                        defaults={'title': message[:50]}
                    )
                    
                    # Enregistrer le message utilisateur
                    ChatMessage.objects.create(
                        conversation=conversation,
                        content=message,
                        is_user=True
                    )
                except App_User.DoesNotExist:
                    pass
            
            # Analyser le message et générer une réponse
            response = ChatService.process_message(message)
            
            # Enregistrer la réponse
            if conversation:
                ChatMessage.objects.create(
                    conversation=conversation,
                    content=response,
                    is_user=False
                )
            
            return JsonResponse({
                'response': response,
                'status': 'success'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Format JSON invalide'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Erreur serveur: {str(e)}'}, status=500)

