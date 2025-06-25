import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <CardTitle className="text-4xl font-bold text-primary mb-2">
            404
          </CardTitle>
          <CardTitle className="text-xl text-gray-700">עמוד לא נמצא</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">העמוד שחיפשת לא קיים במערכת</p>
          <Button onClick={() => navigate("/")} size="lg" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            חזור לעמוד הבחירה
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
