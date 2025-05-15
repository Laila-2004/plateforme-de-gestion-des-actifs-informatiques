import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  createTicketComment,
  getTicketComments,
  deleteTicketComment
} from '../../services/api/commentService';

export default function TicketComments({ ticketId, ticketStatus }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getTicketComments(ticketId);
      setComments(fetchedComments);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les commentaires');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) fetchComments();
  }, [ticketId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const commentData = {
        content: newComment,
        user: currentUser?.user.id
      };
      await createTicketComment(ticketId, commentData);
      setNewComment('');
      await fetchComments();
    } catch (err) {
      setError("Impossible d'ajouter le commentaire");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setLoading(true);
      await deleteTicketComment(commentId);
      await fetchComments();
    } catch (err) {
      setError("Impossible de supprimer le commentaire");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Commentaires</h3>

      {/* Affichage si le ticket est fermé */}
      {ticketStatus === 'fermé' ? (
        <p className="text-gray-600 italic mb-4">
          Ce ticket est fermé. Aucun commentaire ne peut être ajouté.
        </p>
      ) : (
        // Formulaire d'ajout
        <form onSubmit={handleAddComment} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="w-full p-2 border rounded mb-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      )}

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4">
          {error}
        </div>
      )}

      {/* Liste des commentaires */}
      {loading && <p className="text-gray-500">Chargement des commentaires...</p>}

      {!loading && comments.length === 0 && (
        <p className="text-gray-500">Aucun commentaire pour ce ticket.</p>
      )}

      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {comment.author
                    ? ` ${comment.author_name}`
                    : 'Utilisateur'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatCommentDate(comment.created_at)}
                </span>
              </div>
              {comment.user === currentUser?.user.id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={loading}
                >
                  Supprimer
                </button>
              )}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
