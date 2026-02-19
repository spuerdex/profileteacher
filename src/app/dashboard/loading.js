export default function DashboardLoading() {
    return (
        <div className="loading-center">
            <div className="flex flex-col items-center gap-md">
                <div className="spinner-lg"></div>
                <p className="text-muted font-medium">กำลังโหลดข้อมูลแดชบอร์ด...</p>
            </div>
        </div>
    );
}
