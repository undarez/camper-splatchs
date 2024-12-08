import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const ReviewCard = ({ name, rating, comment, date }: ReviewCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-[#A5E9FF]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold">{name}</span>
          <div className="flex">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
            ))}
          </div>
        </div>
        <p className="text-muted-foreground mb-2">{comment}</p>
        <span className="text-sm text-muted-foreground">{date}</span>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
