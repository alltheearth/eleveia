const PageModel = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
    );
}
    

export default PageModel;