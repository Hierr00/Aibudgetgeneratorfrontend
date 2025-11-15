import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { CheckCircle2 } from "lucide-react";

interface MaterialRecommendationProps {
  material: string;
  price: string;
  thickness: string;
  features: string[];
  idealFor: string;
}

export function MaterialRecommendation({
  material,
  price,
  thickness,
  features,
  idealFor,
}: MaterialRecommendationProps) {
  return (
    <Card className="w-full max-w-md border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Recomendación de Material</CardTitle>
          <Badge variant="default" className="text-xs bg-blue-600">
            Óptimo
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-950">{material}</span>
            <span className="text-sm text-blue-600">{price}</span>
          </div>
          <div className="text-xs text-neutral-500">Grosor: {thickness}</div>
        </div>

        <div className="space-y-1.5">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="w-3 h-3 text-blue-600 mt-0.5 shrink-0" />
              <span className="text-xs text-neutral-600">{feature}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-blue-200">
          <div className="text-xs text-neutral-500">Ideal para</div>
          <div className="text-xs text-neutral-950 mt-0.5">{idealFor}</div>
        </div>
      </CardContent>
    </Card>
  );
}
