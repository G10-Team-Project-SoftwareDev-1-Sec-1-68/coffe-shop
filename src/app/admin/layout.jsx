// src/app/dashboard/layout.jsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardLayout({ children }) {
  // เช็คว่าเป็นadmin จริงหรือป่าวเอาออกก่อนเพราะยังไม่มียศadminถ้าทำแล้วก็เอาออกได้เลย
  //const cookieStore = await cookies();
  //const token = cookieStore.get('auth-token')?.value;

  //if (!token) {
  //  redirect('/login?error=please_login');
  //}

  //let userRole = '';
  //userRole = 'admin';

  //if (userRole !== 'admin') {
  //  redirect('/pos?error=unauthorized');
  //}

  // รายการเมนูด้านซ้าย
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: '📈' },
    { name: 'Stock', path: '/admin/stock', icon: '📦' },
    { name: 'Order', path: '/admin/order', icon: '🧾' },
    { name: 'Member', path: '/admin/member', icon: '👥' },
    { name: 'Logs', path: '/admin/log', icon: '📋' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-[#3D2A1E]">
      
      {/* Sidebar ด้านซ้าย */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        
        {/* ส่วนหัว Sidebar (กดแล้วกลับไปหน้าหลักตามที่คุณต้องการ) */}
        <Link 
          href="/pos" 
          className="h-20 flex items-center justify-center bg-[#3D2A1E] text-white hover:bg-[#2E2821] transition-colors cursor-pointer"
        >
          <div className="text-xl font-bold tracking-widest">
            K A F U N G <span className="bg-white text-[#3D2A1E] px-2 py-1 ml-2 text-sm rounded">coffee bar</span>
          </div>
        </Link>

        {/* เมนูนำทาง */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#FDEEEE] hover:text-[#9B8446] transition-all font-medium text-gray-600"
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* ปุ่มตั้งค่า / ออกจากระบบ ด้านล่างสุด */}
        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-4 px-4 py-3 w-full rounded-xl hover:bg-red-50 text-red-600 transition-all font-medium">
            <span className="text-xl">🚪</span>
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* พื้นที่เนื้อหาตรงกลางที่จะเปลี่ยนไปตามเมนูที่กด */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header แถบด้านบน */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-2xl font-bold">ระบบจัดการหลังร้าน</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#9B8446] text-white rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-bold">Admin Manager</p>
              <p className="text-xs text-gray-500">ผู้จัดการร้าน</p>
            </div>
          </div>
        </header>

        {/* เนื้อหาหลัก (Children) */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>

    </div>
  );
}