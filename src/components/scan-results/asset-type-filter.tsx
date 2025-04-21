
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetType, AssetTypeCount } from "@/types/asset-types";

interface AssetTypeFilterProps {
  filterType: AssetType | "all";
  setFilterType: (type: AssetType | "all") => void;
  typeCounts: AssetTypeCount[];
}

export function AssetTypeFilter({ filterType, setFilterType, typeCounts }: AssetTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button
        variant={filterType === "all" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setFilterType("all")}
        className="h-7 text-xs"
      >
        All
      </Button>
      {typeCounts.map(typeCount => (
        <Button
          key={typeCount.type}
          variant={filterType === typeCount.type ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFilterType(typeCount.type)}
          className="h-7 text-xs"
        >
          {typeCount.type}
          <Badge variant="outline" className="ml-1 text-xs">
            {typeCount.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
