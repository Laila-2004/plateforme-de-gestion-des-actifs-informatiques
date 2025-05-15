import React, { useEffect, useState, useRef } from 'react';
import { Bell, X, Check, Clock, Eye, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getchNotifications, markAsRead, deleteNotification } from '../../services/api/notificationService';
import { useAuth}  from '../../context/AuthContext';

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const { currentUser } = useAuth(); 
  
  // Récupérer les notifications et ajouter un délai minimal pour éviter un flash UI
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startTime = Date.now();
      const res = await getchNotifications();
      const userNotifications = res.filter(n => n.user === currentUser?.user.id);
      // Assurer un minimum de 500ms pour le chargement pour éviter les flashs UI
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsedTime));
      }
      
      setNotifications(userNotifications);
    } catch (err) {
      console.error("Erreur de récupération des notifications", err);
      setError("Impossible de charger les notifications");
    } finally {
      setLoading(false);
    }
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialiser et mettre à jour les notifications périodiquement (toutes les 60 secondes)
  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(() => {
      if (!showDropdown) {  // Ne pas rafraîchir si le dropdown est ouvert
        fetchNotifications();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [showDropdown]);

  // Marquer une notification comme lue
  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
      } catch (err) {
        console.error("Erreur lors du marquage comme lu", err);
      }
    }
    
    // Ici vous pourriez ajouter une redirection en fonction du type de notification
    // window.location.href = notif.link;
  };

  // Supprimer une notification
  const handleDelete = async (e, notifId) => {
    e.stopPropagation(); // Empêcher le clic de propager au parent
    
    try {
      await deleteNotification(notifId);
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      
      if (unreadIds.length === 0) return;
      
      await Promise.all(unreadIds.map(id => markAsRead(id)));
      
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error("Erreur lors du marquage de toutes les notifications", err);
    }
  };

  // Formatage du temps relatif (il y a 5 minutes) ou absolu (date normale si > 24h)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } else {
      return format(date, 'dd/MM/yyyy HH:mm');
    }
  };

  // Nombre de notifications non lues
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Définir la priorité visuelle de la notification (couleur)
  const getPriorityStyles = (priority) => {
    switch(priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-orange-500';
      default:
        return 'border-l-4 border-blue-500';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton de notification avec animation de pulsation si nouvelles notifications */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 text-gray-600 hover:text-black rounded-full 
                    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-indigo-400
                    ${unreadCount > 0 ? 'bg-indigo-100' : 'bg-white'}`}
      >
        <Bell size={20} className={unreadCount > 0 ? 'animate-pulse text-indigo-600' : ''} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold 
                          rounded-full min-w-[18px] h-[18px] flex items-center justify-center
                          transform transition-transform duration-200 scale-100">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown des notifications avec animation */}
      {showDropdown && (
        <div 
          className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-white shadow-xl rounded-lg 
                    overflow-hidden z-50 border border-gray-200 transform origin-top-right 
                    transition-transform duration-200 animate-in fade-in"
        >
          {/* En-tête du dropdown */}
          <div className="bg-indigo-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
            <h3 className="font-medium text-gray-800">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-2 py-1 
                          rounded flex items-center space-x-1 transition-colors duration-150"
                >
                  <Check size={14} />
                  <span>Tout marquer comme lu</span>
                </button>
              )}
            </div>
          </div>

          {/* Corps du dropdown */}
          <div className="max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="text-gray-400 text-sm p-8 text-center flex flex-col items-center">
                <Bell size={32} className="mb-2 text-gray-300" />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`border-b hover:bg-gray-50 cursor-pointer
                            transition-colors duration-150 relative group ${notif.read ? 'bg-white' : 'bg-blue-50'} 
                            ${getPriorityStyles(notif.priority)}`}
                >
                  <div className="px-4 py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-sm ${notif.read ? 'text-gray-700' : 'text-black font-medium'}`}>
                          {notif.message}
                        </p>
                        <div className="text-xs text-gray-400 mt-1 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatTime(notif.created_at)}
                        </div>
                      </div>
                      
                      {/* Actions sur la notification (apparaît au survol) */}
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                 flex space-x-1 ml-2"
                      >
                        <button 
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-300 rounded-full bg-white "
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notif);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-300 rounded-full bg-white "
                          onClick={(e) => handleDelete(e, notif.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Détails supplémentaires ou catégorie */}
                    {notif.category && (
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100">
                          {notif.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pied du dropdown (voir tout) */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 p-2">
              <button 
                className="w-full px-3 py-2 text-sm text-center text-indigo-600 hover:bg-indigo-50 
                          rounded transition-colors duration-150 bg-white"
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}