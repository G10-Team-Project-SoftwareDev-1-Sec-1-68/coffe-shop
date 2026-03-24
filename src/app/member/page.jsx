'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';

export default function MemberPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(2000);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setPoints(data.user.points || 2000);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };

    loadUser();
  }, [router]);

  const handleRedeem = (cost) => {
    if (points < cost) {
      alert('แต้มไม่พอ');
      return;
    }
    const newPoints = points - cost;
    setPoints(newPoints);
    alert(`แลกสำเร็จ! เหลือ ${newPoints} แต้ม`);
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        กำลังโหลด...
      </div>
    );
  }

  return (
    <>
      <Header />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px',
        backgroundColor: '#F7EFE3'
      }}>
        {/* Points Card */}
        <div style={{
          background: 'linear-gradient(135deg, #C8942A 0%, #D4A237 50%, #7A4F2D 100%)',
          borderRadius: '20px',
          padding: '40px',
          color: 'white',
          marginBottom: '40px',
          boxShadow: '0 10px 30px rgba(122, 79, 45, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>สมา {user.firstName}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>ID {user.id?.substring(0, 8) || 'N/A'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{points.toLocaleString()}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>แต้ม</div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '8px' }}>วันหมดอายุ xx-xx-xx</div>
          </div>
        </div>

        {/* Rewards Section */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#3B2410',
          marginBottom: '20px',
          marginTop: '40px'
        }}>
          ของรางวัลแนะนำ
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {/* Reward 1 */}
          <div style={{
            background: 'white',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            borderLeft: '5px solid #C8942A',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #C8942A 0%, #D4A237 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: 'white',
              fontSize: '24px'
            }}>
              🎁
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3B2410', margin: '0 0 4px 0' }}>
              ส่วนลด 50 บาท
            </h3>
            <p style={{ fontSize: '12px', color: '#6B4A2A', margin: '0 0 12px 0', opacity: 0.8 }}>
              คูปองส่วนลดแทนเงินสด
            </p>
            <div style={{ fontSize: '12px', color: '#C8942A', fontWeight: '700', marginBottom: '12px' }}>
              ใช้ 50 แต้ม
            </div>
            <button
              onClick={() => handleRedeem(50)}
              style={{
                background: '#3B2410',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: '0.3s',
                marginTop: 'auto'
              }}
              onMouseOver={(e) => e.target.style.background = '#C8942A'}
              onMouseOut={(e) => e.target.style.background = '#3B2410'}
            >
              แลก
            </button>
          </div>

          {/* Reward 2 */}
          <div style={{
            background: 'white',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            borderLeft: '5px solid #C8942A',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #C8942A 0%, #D4A237 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: 'white',
              fontSize: '24px'
            }}>
              ✨
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3B2410', margin: '0 0 4px 0' }}>
              ของสมนาคุณ
            </h3>
            <p style={{ fontSize: '12px', color: '#6B4A2A', margin: '0 0 12px 0', opacity: 0.8 }}>
              Limited Edition
            </p>
            <div style={{ fontSize: '12px', color: '#C8942A', fontWeight: '700', marginBottom: '12px' }}>
              ใช้ 200 แต้ม
            </div>
            <button
              onClick={() => handleRedeem(200)}
              style={{
                background: '#3B2410',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: '0.3s',
                marginTop: 'auto'
              }}
              onMouseOver={(e) => e.target.style.background = '#C8942A'}
              onMouseOut={(e) => e.target.style.background = '#3B2410'}
            >
              แลก
            </button>
          </div>

          {/* Reward 3 */}
          <div style={{
            background: 'white',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            borderLeft: '5px solid #C8942A',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #C8942A 0%, #D4A237 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: 'white',
              fontSize: '24px'
            }}>
              ☕
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3B2410', margin: '0 0 4px 0' }}>
              เครื่องดื่มฟรี 1 แก้ว
            </h3>
            <p style={{ fontSize: '12px', color: '#6B4A2A', margin: '0 0 12px 0', opacity: 0.8 }}>
              เลือกเมนูใดก็ได้
            </p>
            <div style={{ fontSize: '12px', color: '#C8942A', fontWeight: '700', marginBottom: '12px' }}>
              ใช้ 500 แต้ม
            </div>
            <button
              onClick={() => handleRedeem(500)}
              style={{
                background: '#3B2410',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: '0.3s',
                marginTop: 'auto'
              }}
              onMouseOver={(e) => e.target.style.background = '#C8942A'}
              onMouseOut={(e) => e.target.style.background = '#3B2410'}
            >
              แลก
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
