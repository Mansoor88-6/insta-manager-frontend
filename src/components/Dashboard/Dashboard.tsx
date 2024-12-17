import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import InstagramConnect from '../Instagram/InstagramConnect'
import ImageUpload from '../Instagram/ImageUpload'

type InstagramProfile = {
  username: string
  profile_picture_url: string
}

type InstagramPost = {
  id: string
  caption: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  thumbnail_url?: string
  timestamp: string
}

type PaginationInfo = {
  currentPage: number
  totalPages: number
  totalPosts: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  limit: number
}

type InstagramAccount = {
  instagram_account_id: string
  connected_at: string
}

/**
 * Main dashboard component that handles:
 * 1. Instagram account connection status check
 * 2. Fetching and displaying user's Instagram posts with pagination
 * 3. Displaying user's Instagram profile information
 * 4. Image upload functionality for new posts
 * 
 * Flow:
 * - Checks if user has connected Instagram account
 * - If connected, fetches profile and posts
 * - If not connected, shows Instagram connect component
 * - Handles pagination for posts display
 */
export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [instagramAccount, setInstagramAccount] = useState<InstagramAccount | null>(null)
  const [profile, setProfile] = useState<InstagramProfile | null>(null)
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true)
      const postsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/instagram/posts/${user?.id}?page=${page}`
      )
      const postsData = await postsResponse.json()

      if (!postsResponse.ok) {
        throw new Error(postsData.details || postsData.error || 'Failed to fetch posts')
      }
      setPosts(postsData.posts)
      setProfile(postsData.profile)
      setPagination(postsData.pagination)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function checkInstagramConnection() {
      try {
        const { data, error } = await supabase
          .from('instagram_accounts')
          .select('instagram_account_id, connected_at')
          .eq('user_id', user?.id)
          .single()

        if (error) throw error
        setInstagramAccount(data)

        if (data) {
          await fetchPosts(1)
        }
      } catch (error) {
        console.error('Error:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
        setLoading(false)
      }
    }

    if (user) {
      checkInstagramConnection()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage)
    await fetchPosts(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && !posts.length) {
    return <div>Loading...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user?.email}</h2>
        <button className="sign-out-btn" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
      <div className="dashboard-content">
        {error && <div className="error">{error}</div>}
        
        {instagramAccount ? (
          <div className="instagram-connected">
            {profile && (
              <div className="instagram-profile">
                <img 
                  src={profile.profile_picture_url} 
                  alt={profile.username}
                  className="profile-picture"
                />
                <div className="profile-info">
                  <h3>@{profile.username}</h3>
                  <p>{pagination?.totalPosts || 0} posts</p>
                </div>
              </div>
            )}
            <ImageUpload />
            {posts.length > 0 ? (
              <>
                <div className="instagram-posts-grid">
                  {posts.map(post => (
                    <div key={post.id} className="instagram-post-card">
                      <div className="post-media">
                        {post.media_type === 'VIDEO' ? (
                          <video 
                            src={post.media_url} 
                            controls 
                            poster={post.thumbnail_url}
                          />
                        ) : (
                          <img 
                            src={post.media_url} 
                            alt={post.caption?.slice(0, 50) || 'Instagram post'} 
                          />
                        )}
                      </div>
                      <div className="post-details">
                        <p className="post-caption">{post.caption}</p>
                        <a 
                          href={post.permalink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="view-on-instagram"
                        >
                          View on Instagram
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                {pagination && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPreviousPage || loading}
                      className="pagination-btn"
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage || loading}
                      className="pagination-btn"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>No posts found</p>
            )}
          </div>
        ) : (
          <InstagramConnect />
        )}
      </div>
    </div>
  )
} 