import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCube, faHome, faUsers, faChartBar, faShoppingCart, faBox, faCog, 
  faSearch, faBell, faDollarSign, faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import '../App.css';

Chart.register(...registerables);

const AdminDashboard = () => {
  const chartRef = useRef(null);         // reference to canvas
  const chartInstanceRef = useRef(null); // reference to Chart instance

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: [25000, 32000, 28000, 35000, 42000, 48000],
          borderColor: '#1e40af',
          backgroundColor: 'rgba(30, 64, 175, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#1e40af',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#6b7280' } },
          y: { 
            beginAtZero: true, 
            grid: { color: '#f3f4f6' }, 
            ticks: { color: '#6b7280', callback: (value) => '$' + value.toLocaleString() } 
          }
        },
        elements: { point: { hoverRadius: 8 } }
      }
    });

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Sidebar navigation active state
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('bg-gray-700', 'text-white'));
        navLinks.forEach(l => l.classList.add('text-gray-300'));
        this.classList.add('bg-gray-700', 'text-white');
        this.classList.remove('text-gray-300');
      });
    });
    navLinks[0].classList.add('bg-gray-700', 'text-white');
    navLinks[0].classList.remove('text-gray-300');

    // Notification bell animation
    const bellIcon = document.querySelector('.fa-bell');
    let interval;
    if (bellIcon) {
      interval = setInterval(() => {
        bellIcon.classList.add('animate-pulse');
        setTimeout(() => bellIcon.classList.remove('animate-pulse'), 1000);
      }, 5000);
    }

    // Stats cards hover effects
    const statsCards = document.querySelectorAll('.hover\\:shadow-md');
    statsCards.forEach(card => {
      card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-2px)');
      card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-cordes-dark shadow-xl z-50">
        <div className="flex items-center justify-center h-16 bg-cordes-blue">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faCube} className="text-cordes-blue text-lg" />
            </div>
            <span className="text-white text-xl font-bold">Cordes</span>
          </div>
        </div>
        <nav className="mt-8 px-4 space-y-2">
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors group">
            <FontAwesomeIcon icon={faHome} className="mr-3 text-cordes-accent group-hover:text-white" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors group">
            <FontAwesomeIcon icon={faUsers} className="mr-3 text-gray-400 group-hover:text-white" />
            Users
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors group">
            <FontAwesomeIcon icon={faChartBar} className="mr-3 text-gray-400 group-hover:text-white" />
            Analytics
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors group">
            <FontAwesomeIcon icon={faShoppingCart} className="mr-3 text-gray-400 group-hover:text-white" />
            Orders
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors group">
            <FontAwesomeIcon icon={faBox} className="mr-3 text-gray-400 group-hover:text-white" />
            Products
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors group">
            <FontAwesomeIcon icon={faCog} className="mr-3 text-gray-400 group-hover:text-white" />
            Settings
          </a>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
            <img src="https://cdn-icons-png.flaticon.com/512/17003/17003310.png" alt="Admin" className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-white text-sm font-medium">John Admin</p>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 text-sm mt-1">Welcome back, here's what's happening today</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cordes-accent focus:border-transparent outline-none" />
              </div>
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <FontAwesomeIcon icon={faBell} className="text-xl" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">$48,291</p>
                  <div className="flex items-center mt-2">
                    <span className="text-green-600 text-sm font-medium flex items-center">
                      <FontAwesomeIcon icon={faArrowUp} className="mr-1" />12%
                    </span>
                    <span className="text-gray-500 text-sm ml-2">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-cordes-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faDollarSign} className="text-cordes-blue text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 lg:col-span-2">
            <canvas ref={chartRef} className="h-80 w-full"></canvas>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
