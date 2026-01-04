import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-8xl font-bold gradient-text">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button variant="hero" size="lg" className="gap-2">
                <Home className="w-5 h-5" />
                Go Home
              </Button>
            </Link>
            <Button
              variant="glass"
              size="lg"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
