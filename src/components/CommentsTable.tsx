import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Search, Edit2, Check, X } from 'lucide-react';

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
}

interface Post {
  id: number;
  title: string;
}

interface EditableComment extends Comment {
  originalName: string;
  originalBody: string;
  isEditingName: boolean;
  isEditingBody: boolean;
}

const CommentsTable: React.FC = () => {
  const [comments, setComments] = useState<EditableComment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentsResponse, postsResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/comments'),
          fetch('https://jsonplaceholder.typicode.com/posts'),
        ]);

        const commentsData = await commentsResponse.json();
        const postsData = await postsResponse.json();

        const editableComments = commentsData.map((comment: Comment) => ({
          ...comment,
          originalName: comment.name,
          originalBody: comment.body,
          isEditingName: false,
          isEditingBody: false,
        }));

        setComments(editableComments);
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredComments = useMemo(() => {
    return comments.filter((comment) =>
      comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [comments, searchTerm]);

  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const paginatedComments = filteredComments.slice(startIndex, startIndex + commentsPerPage);

  const handleEdit = (id: number, field: 'name' | 'body') => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? { ...comment, [`isEditing${field.charAt(0).toUpperCase() + field.slice(1)}`]: true }
          : comment
      )
    );
  };

  const handleSave = (id: number, field: 'name' | 'body', value: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              [field]: value,
              [`original${field.charAt(0).toUpperCase() + field.slice(1)}`]: value,
              [`isEditing${field.charAt(0).toUpperCase() + field.slice(1)}`]: false,
            }
          : comment
      )
    );
  };

  const handleCancel = (id: number, field: 'name' | 'body') => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              [field]: comment[`original${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof EditableComment],
              [`isEditing${field.charAt(0).toUpperCase() + field.slice(1)}`]: false,
            }
          : comment
      )
    );
  };

  const getPostTitle = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    return post ? post.title : 'Unknown Post';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading comments...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Search */}
      <div className="relative flex-shrink-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search comments by name, email, or content..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="input-professional w-full pl-10"
        />
      </div>

      {/* Table */}
      <div className="card-professional flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-auto rounded-md">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-muted shadow-sm">
              <tr>
                <th className="table-heading">Email</th>
                <th className="table-heading">Name</th>
                <th className="table-heading">Body</th>
                <th className="table-heading">Post</th>
                <th className="table-heading">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComments.map((comment, index) => (
                <tr
                  key={comment.id}
                  className={`table-row ${index % 2 === 0 ? 'bg-background/50' : 'bg-muted/20'}`}
                >
                  <td className="p-4 text-sm text-muted-foreground">{comment.email}</td>

                  {/* Name */}
                  <td className="p-4">
                    {comment.isEditingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={comment.name}
                          onChange={(e) =>
                            setComments((prev) =>
                              prev.map((c) => (c.id === comment.id ? { ...c, name: e.target.value } : c))
                            )
                          }
                          className="input-professional text-sm min-w-0 flex-1"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSave(comment.id, 'name', comment.name)}
                          className="p-1 text-primary hover:bg-primary/10 rounded transition-all duration-200 transform hover:scale-110"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancel(comment.id, 'name')}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded transition-all duration-200 transform hover:scale-110"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{comment.name}</span>
                        <button
                          onClick={() => handleEdit(comment.id, 'name')}
                          className="p-1 text-muted-foreground hover:text-primary transition-all duration-200 transform hover:scale-110"
                          title="Edit name"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Body */}
                  <td className="p-4 max-w-md">
                    {comment.isEditingBody ? (
                      <div className="flex items-start gap-2">
                        <textarea
                          value={comment.body}
                          onChange={(e) =>
                            setComments((prev) =>
                              prev.map((c) => (c.id === comment.id ? { ...c, body: e.target.value } : c))
                            )
                          }
                          className="input-professional text-sm min-w-0 flex-1 min-h-[80px] resize-none"
                          autoFocus
                        />
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleSave(comment.id, 'body', comment.body)}
                            className="p-1 text-primary hover:bg-primary/10 rounded transition-all duration-200 transform hover:scale-110"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancel(comment.id, 'body')}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded transition-all duration-200 transform hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <p className="text-sm text-foreground leading-relaxed">{comment.body}</p>
                        <button
                          onClick={() => handleEdit(comment.id, 'body')}
                          className="p-1 text-muted-foreground hover:text-primary transition-all duration-200 transform hover:scale-110 flex-shrink-0 mt-1"
                          title="Edit body"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="p-4 max-w-xs">
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {getPostTitle(comment.postId)}
                    </span>
                  </td>

                  <td className="p-4">
                    <button className="btn-edit text-xs">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-xs px-3 py-1"
          >
            Prev
          </button>
          <span className="text-xs text-muted-foreground px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-xs px-3 py-1"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsTable;
