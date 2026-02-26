import React from 'react';
import { Link } from 'react-router-dom';
import './profile.css'; // Предполагаем, что стили уже существуют

const Profile = () => {
  // Пример данных пользователя (в реальности берутся из стейта или API)
  const user = {
    name: 'Пися Писивич',
    email: 'pisun@gmail.com',
    avatar: 'П',
    stats: {
      totalReadings: 12,
      monthReadings: 5,
      savedLayouts: 3
    }
  };

  // Пример истории гаданий (в реальности берутся из API)
  const readingHistory = [
    {
      id: 1,
      name: 'Кельтский крест',
      description: 'Вопрос о карьере и профессиональном развитии',
      date: '17 апреля 2025',
      time: '19:30',
      icon: 'star'
    },
    {
      id: 2,
      name: 'Расклад на отношения',
      description: 'Анализ текущих отношений и перспектив',
      date: '15 апреля 2025',
      time: '21:15',
      icon: 'heart'
    },
    {
      id: 3,
      name: 'Расклад на день',
      description: 'Энергии и возможности текущего дня',
      date: '14 апреля 2025',
      time: '08:45',
      icon: 'sun'
    },
    {
      id: 4,
      name: 'Таро Ленорман',
      description: 'Предсказание на ближайшее будущее',
      date: '10 апреля 2025',
      time: '22:05',
      icon: 'moon'
    }
  ];

  // Пример сохраненных раскладов
  const savedReadings = [
    {
      id: 1,
      name: 'Кельтский крест',
      savedDate: '15 апреля 2025'
    },
    {
      id: 2,
      name: 'Расклад на любовь',
      savedDate: '12 апреля 2025'
    },
    {
      id: 3,
      name: 'Таро Ленорман',
      savedDate: '5 апреля 2025'
    }
  ];

  return (
    <>
      <div className="stars-bg" id="stars"></div>

      <header>
        <div className="container">
          <nav>
            <Link to="/" className="logo">
              <i className="fas fa-moon"></i> Mystic<span>Tarot</span>
            </Link>

            <ul className="menu">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/readings">Расклады</Link></li>
              <li><Link to="/cards">Карты</Link></li>
              <li><Link to="/blog">Блог</Link></li>
            </ul>

            <div className="user-actions">
              <div className="user-avatar">{user.avatar}</div>
              <Link to="/login" className="btn btn-outline">Выйти</Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="dashboard-header">
            <div className="dashboard-title">
              <div>
                <h1>Личный кабинет</h1>
                <p className="dashboard-subtitle">
                  Добро пожаловать, {user.name.split(' ')[0]}! Здесь вы можете управлять своими
                  гаданиями и настройками профиля.
                </p>
              </div>
              <Link to="/new-reading" className="btn btn-primary">Новое гадание</Link>
            </div>

            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{user.stats.totalReadings}</h3>
                <p>Всего гаданий</p>
              </div>
              <div className="stat-card">
                <h3>{user.stats.monthReadings}</h3>
                <p>В этом месяце</p>
              </div>
              <div className="stat-card">
                <h3>{user.stats.savedLayouts}</h3>
                <p>Сохраненных раскладов</p>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="main-content">
              <div className="card">
                <div className="card-header">
                  <h2>История гаданий</h2>
                  <Link to="/all-readings" className="btn btn-outline">Смотреть все</Link>
                </div>

                <div className="reading-history">
                  {readingHistory.map(reading => (
                    <div className="reading-item" key={reading.id}>
                      <div className="reading-icon">
                        <i className={`fas fa-${reading.icon}`}></i>
                      </div>
                      <div className="reading-details">
                        <h3>{reading.name}</h3>
                        <p>{reading.description}</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                          {reading.date} • {reading.time}
                        </p>
                      </div>
                      <div className="reading-actions">
                        <button className="action-btn">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn">
                          <i className="fas fa-bookmark"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2>Сохраненные расклады</h2>
                  <Link to="/manage-saved" className="btn btn-outline">Управление</Link>
                </div>

                <div className="reading-history">
                  {savedReadings.map(saved => (
                    <div className="reading-item" key={saved.id}>
                      <div className="reading-icon">
                        <i className="fas fa-bookmark"></i>
                      </div>
                      <div className="reading-details">
                        <h3>{saved.name}</h3>
                        <p>Сохранено {saved.savedDate}</p>
                      </div>
                      <div className="reading-actions">
                        <button className="action-btn">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sidebar">
              <div className="card">
                <div className="user-profile">
                  <div className="profile-avatar">{user.avatar}</div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <div className="profile-actions">
                    <button className="btn btn-outline">Изменить профиль</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2025 MysticTarot. Все права защищены.</p>
        </div>
      </footer>
    </>
  );
};

export default Profile;