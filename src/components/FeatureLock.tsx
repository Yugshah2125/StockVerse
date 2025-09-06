import { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { useFeatureLock } from '@/hooks/useFeatureLock';
import { useToast } from '@/hooks/use-toast';

interface FeatureLockProps {
  featureKey: string;
  children: ReactNode;
  className?: string;
  showOverlay?: boolean;
}

export const FeatureLock = ({ 
  featureKey, 
  children, 
  className = '', 
  showOverlay = true 
}: FeatureLockProps) => {
  const { isLocked, requirement } = useFeatureLock(featureKey);
  const { toast } = useToast();

  const handleLockedClick = () => {
    if (isLocked && requirement) {
      toast({
        title: "Feature Locked",
        description: requirement.message,
        variant: "destructive",
      });
    }
  };

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div 
      className={`relative ${className}`}
      onClick={handleLockedClick}
    >
      {/* Blurred content */}
      <div className={showOverlay ? "blur-sm pointer-events-none" : ""}>
        {children}
      </div>
      
      {/* Lock overlay */}
      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm cursor-pointer">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Lock className="w-8 h-8" />
            <p className="text-sm font-medium text-center">
              {requirement?.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};