import React, { useState, useEffect } from "react";
import { CommunityPost, User } from "../entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  MessageCircle, 
  Plus, 
  Heart, 
  MapPin, 
  Calendar,
  User as UserIcon,
  Search,
  Filter,
  CheckCircle,
  TrendingUp,
  Users,
  Award,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'question',
    location: '',
    tags: []
  });

  useEffect(() => {
    loadPosts();
    loadCurrentUser();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await CommunityPost.list("-created_date");
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.log("User not authenticated:", error);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = newPost.tags.length > 0 ? newPost.tags.split(',').map(tag => tag.trim()) : [];
      
      await CommunityPost.create({
        ...newPost,
        tags: tagsArray
      });
      
      setNewPost({
        title: '',
        content: '',
        category: 'question',
        location: '',
        tags: []
      });
      setShowNewPost(false);
      loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLikePost = async (postId) => {
    // This would typically update the likes count
    // For now, just simulate the action
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes_count: (post.likes_count || 0) + 1 }
        : post
    ));
  };

  const categories = [
    { id: 'all', name: 'All Posts', color: 'bg-gray-100 text-gray-800', icon: MessageCircle },
    { id: 'question', name: 'Questions', color: 'bg-blue-100 text-blue-800', icon: MessageSquare },
    { id: 'tip', name: 'Tips', color: 'bg-green-100 text-green-800', icon: TrendingUp },
    { id: 'problem', name: 'Problems', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
    { id: 'success_story', name: 'Success Stories', color: 'bg-purple-100 text-purple-800', icon: Award },
    { id: 'market_update', name: 'Market Updates', color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp },
    { id: 'general', name: 'General', color: 'bg-gray-100 text-gray-800', icon: Users }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.tags && post.tags.some(tag => 
                           tag.toLowerCase().includes(searchQuery.toLowerCase())
                         ));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || MessageCircle;
  };

  const getPostStats = () => {
    const totalPosts = posts.length;
    const questions = posts.filter(p => p.category === 'question').length;
    const resolved = posts.filter(p => p.is_resolved).length;
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes_count || 0), 0);
    
    return { totalPosts, questions, resolved, totalLikes };
  };

  const stats = getPostStats();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-emerald-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-emerald-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">
            🌾 Farming Community
          </h1>
          <p className="text-emerald-600 text-lg">
            Connect with fellow farmers, share knowledge and get help
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.totalPosts}</div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.questions}</div>
            <div className="text-sm text-gray-600">Questions</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-red-600">{stats.totalLikes}</div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Button
              onClick={() => setShowNewPost(true)}
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search posts, tags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`text-sm gap-2 ${
                  selectedCategory === category.id 
                    ? "bg-emerald-600 hover:bg-emerald-700" 
                    : "hover:bg-emerald-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <Card className="mb-8 border-2 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                Create New Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <Input
                  placeholder="What's your question or topic?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  required
                />
                
                <Textarea
                  placeholder="Share your question, tip, or experience in detail..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={4}
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Select
                    value={newPost.category}
                    onValueChange={(value) => setNewPost({...newPost, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c.id !== 'all').map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Location (optional)"
                    value={newPost.location}
                    onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                  />
                </div>

                <Input
                  placeholder="Tags (comma-separated, e.g., tomatoes, organic, pest-control)"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                />

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewPost(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Post
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const CategoryIcon = getCategoryIcon(post.category);
            return (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getCategoryColor(post.category)}>
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {categories.find(c => c.id === post.category)?.name}
                        </Badge>
                        {post.is_resolved && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg text-emerald-900 mb-2 hover:text-emerald-700 cursor-pointer">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-4 h-4" />
                          {post.created_by || 'Anonymous Farmer'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(post.created_date), "MMM d, yyyy")}
                        </div>
                        {post.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {post.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {post.content.length > 300 
                      ? `${post.content.substring(0, 300)}...` 
                      : post.content
                    }
                  </p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 5).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 cursor-pointer">
                          #{tag}
                        </Badge>
                      ))}
                      {post.tags.length > 5 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                          +{post.tags.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2 text-gray-600 hover:text-red-600"
                        onClick={() => handleLikePost(post.id)}
                      >
                        <Heart className="w-4 h-4" />
                        {post.likes_count || 0} likes
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-emerald-600">
                        <MessageCircle className="w-4 h-4" />
                        {post.replies_count || 0} replies
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-300 hover:bg-emerald-50">
                        Reply
                      </Button>
                      {post.category === 'question' && !post.is_resolved && (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                          Help
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <Card className="text-center py-12 border-2 border-dashed border-emerald-200">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedCategory !== 'all'
                  ? "Try adjusting your search terms or filters" 
                  : "Be the first to start a discussion in our farming community!"
                }
              </p>
              <div className="flex gap-3 justify-center">
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    Clear Filters
                  </Button>
                )}
                <Button
                  onClick={() => setShowNewPost(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Create First Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}