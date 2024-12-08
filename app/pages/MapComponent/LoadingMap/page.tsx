const LoadingMap = () => {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border">
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement de la carte...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingMap;
