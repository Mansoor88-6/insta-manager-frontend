declare global {
  interface Window {
    fbAsyncInit: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB: any;
  }
}

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import FacebookLogin from "@greatsumini/react-facebook-login";

type FacebookPage = {
  id: string;
  name: string;
  access_token: string;
};

/**
 * Handles Instagram account connection process:
 * 1. Facebook login integration
 * 2. Fetching user's Facebook pages
 * 3. Linking selected Facebook page's Instagram account
 *
 * Flow:
 * - User authenticates with Facebook
 * - Fetches associated Facebook pages
 * - User selects a page with Instagram account
 * - Establishes connection with Instagram Business/Creator account
 */
export default function InstagramConnect() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const { user } = useAuth();

  const handleFacebookResponse = async (response: { accessToken?: string }) => {
    try {
      setLoading(true);
      setError(null);

      if (response.accessToken) {
        const pagesResponse = await fetch(
          `https://graph.facebook.com/v21.0/me/accounts?access_token=${response.accessToken}`
        );
        const pagesData = await pagesResponse.json();

        if (pagesData.error) {
          throw new Error(pagesData.error.message);
        }

        setPages(pagesData.data);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to connect to Instagram"
      );
      console.error("Instagram connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = async (pageId: string, accessToken: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/instagram/setup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shortLivedToken: accessToken,
            userId: user?.id,
            facebookPageId: pageId,
          }),
        }
      );

      const data = await result.json();

      if (!result.ok) {
        throw new Error(
          data.details || data.error || "Failed to connect Instagram account"
        );
      }

      window.location.href = "/instagram-success";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to connect Instagram account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="instagram-connect-card">
      <div className="card-content">
        <h3>Connect Instagram</h3>
        <p>
          Link your Instagram Professional account to manage your posts and
          content.
        </p>
        {error && <div className="error">{error}</div>}

        {pages.length === 0 ? (
          <FacebookLogin
            appId={import.meta.env.VITE_FACEBOOK_APP_ID}
            onSuccess={handleFacebookResponse}
            scope="pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,business_management"
            className="instagram-connect-btn"
            style={{
              backgroundColor: "#1877f2",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Connecting..." : "Connect with Facebook"}
          </FacebookLogin>
        ) : (
          <div className="page-selection">
            <h4>Select your Facebook Page</h4>
            <div className="pages-list">
              {pages.map((page) => (
                <button
                  key={page.id}
                  className="page-select-btn"
                  onClick={() => handlePageSelect(page.id, page.access_token)}
                  disabled={loading}
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="info-text">
          Note: Your Instagram account must be a Professional account (Business
          or Creator) and connected to a Facebook Page for this to work
          Properly.
        </p>
      </div>
    </div>
  );
}
