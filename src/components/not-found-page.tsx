
import { Link } from "react-router-dom";
import { Home, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";

export function NotFoundPage() {
  return (
    <PageContainer className="flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-harvester-300">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-white">Page Not Found</h2>
        <p className="text-harvester-200 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/" className="text-harvester-300">
              <FileSearch className="mr-2 h-4 w-4" />
              Scan a Website
            </Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
