
import { Asset } from "@/types/asset-types";
import { AssetCard } from "@/components/asset-card";

interface AssetsGridProps {
  assets: Asset[];
  selectedAssets: string[];
  onToggleSelect: (id: string, selected: boolean) => void;
}

export function AssetsGrid({ assets, selectedAssets, onToggleSelect }: AssetsGridProps) {
  if (assets.length === 0) {
    return (
      <div className="bg-harvester-900/30 rounded-lg p-8 text-center">
        <p className="text-harvester-300">No assets match your filter criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={{
            ...asset,
            selected: selectedAssets.includes(asset.id),
          }}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
