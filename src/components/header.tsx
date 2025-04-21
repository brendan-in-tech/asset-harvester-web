
import { Link } from "react-router-dom"
import { Download, GitFork, Search } from "lucide-react"

export function Header() {
  return (
    <header className="w-full py-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Download className="text-harvester-300 h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-harvester-200 to-harvester-400">
            Asset Harvester
          </h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/" 
                className="flex items-center text-harvester-100 hover:text-harvester-300 transition-colors"
              >
                <Search className="h-4 w-4 mr-1" />
                <span>Scan</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/history" 
                className="flex items-center text-harvester-100 hover:text-harvester-300 transition-colors"
              >
                <GitFork className="h-4 w-4 mr-1" />
                <span>History</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
