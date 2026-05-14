import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-extrabold text-primary/20 mb-4">404</div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">Page Not Found</h1>
      <p className="text-sm text-text-muted mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/"><Button>Go Home</Button></Link>
    </div>
  );
}
