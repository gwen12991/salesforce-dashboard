
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, RefreshCw, Play, BarChart3, CheckCircle, AlertCircle, Link } from 'lucide-react';

const SalesforceDashboard = () => {
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('apiUrl') || '');
  const [isConnected, setIsConnected] = useState(false);
  const [showSetup, setShowSetup] = useState(!localStorage.getItem('apiUrl'));
  
  const [vacationMode, setVacationMode] = useState(false);
  const [skipWeekends, setSkipWeekends] = useState(true);
  const [skipHolidays, setSkipHolidays] = useState(true);
  const [autoRun, setAutoRun] = useState(true);
  const [recordsPerDay, setRecordsPerDay] = useState(150);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    remaining: 0,
    lastRun: null,
    nextRun: null,
    processedToday: 0
  });

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)',
      padding: '16px',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    maxWidth: {
      maxWidth: '896px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px',
      paddingTop: '24px'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '14px'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      marginBottom: '16px'
    },
    statCard: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      marginBottom: '16px',
      borderLeft: '4px solid'
    },
    statLabel: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '4px'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1F2937'
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    toggle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      marginBottom: '12px'
    },
    toggleLabel: {
      fontWeight: '500',
      color: '#1F2937',
      fontSize: '15px'
    },
    toggleDesc: {
      fontSize: '13px',
      color: '#6B7280',
      marginTop: '4px'
    },
    toggleSwitch: {
      position: 'relative',
      display: 'inline-flex',
      height: '32px',
      width: '56px',
      alignItems: 'center',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      border: 'none'
    },
    toggleCircle: {
      display: 'inline-block',
      height: '24px',
      width: '24px',
      borderRadius: '50%',
      background: 'white',
      transition: 'transform 0.3s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    button: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '16px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      marginBottom: '12px'
    },
    buttonPrimary: {
      background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
      color: 'white',
      boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)'
    },
    buttonSecondary: {
      background: 'white',
      color: '#374151',
      border: '2px solid #D1D5DB'
    },
    buttonDisabled: {
      background: '#9CA3AF',
      cursor: 'not-allowed',
      boxShadow: 'none'
    },
    progressBar: {
      width: '100%',
      height: '12px',
      background: '#E5E7EB',
      borderRadius: '6px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #3B82F6 0%, #4F46E5 100%)',
      transition: 'width 0.5s ease',
      borderRadius: '6px'
    },
    alert: {
      background: '#FEF3C7',
      borderLeft: '4px solid #F59E0B',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    alertText: {
      color: '#92400E',
      fontWeight: '500',
      fontSize: '14px'
    },
    connectionBadge: {
      padding: '12px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      fontSize: '14px',
      fontWeight: '500'
    },
    setupContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    setupCard: {
      maxWidth: '448px',
      width: '100%',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '32px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '16px',
      boxSizing: 'border-box'
    },
    infoBox: {
      marginTop: '24px',
      padding: '16px',
      background: '#EFF6FF',
      borderRadius: '8px'
    },
    slider: {
      width: '100%',
      height: '8px',
      borderRadius: '4px',
      background: '#E5E7EB',
      outline: 'none',
      appearance: 'none',
      WebkitAppearance: 'none'
    }
  };

  const loadData = async () => {
    if (!apiUrl) return;
    
    try {
      // Direct fetch attempt first
      let statsResponse;
      let settingsResponse;
      
      try {
        statsResponse = await fetch(`${apiUrl}?action=getStats`);
        settingsResponse = await fetch(`${apiUrl}?action=getSettings`);
      } catch (corsError) {
        // If CORS fails, try with a proxy
        const proxyUrl = 'https://corsproxy.io/?';
        statsResponse = await fetch(`${proxyUrl}${encodeURIComponent(apiUrl + '?action=getStats')}`);
        settingsResponse = await fetch(`${proxyUrl}${encodeURIComponent(apiUrl + '?action=getSettings')}`);
      }
      
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      const settingsData = await settingsResponse.json();
      
      setVacationMode(settingsData.vacationMode);
      setSkipWeekends(settingsData.skipWeekends);
      setSkipHolidays(settingsData.skipHolidays);
      setAutoRun(settingsData.autoRun);
      setRecordsPerDay(settingsData.recordsPerDay);
      
      setIsConnected(true);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsConnected(false);
    }
  };

  const saveSettings = async (newSettings) => {
    if (!apiUrl) return;
    
    try {
      let response;
      
      try {
        response = await fetch(`${apiUrl}?action=updateSettings`, {
          method: 'POST',
          body: JSON.stringify(newSettings)
        });
      } catch (corsError) {
        const proxyUrl = 'https://corsproxy.io/?';
        response = await fetch(`${proxyUrl}${encodeURIComponent(apiUrl + '?action=updateSettings')}`, {
          method: 'POST',
          body: JSON.stringify(newSettings)
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  useEffect(() => {
    if (apiUrl) {
      loadData();
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (isConnected) {
      saveSettings({
        vacationMode,
        skipWeekends,
        skipHolidays,
        autoRun,
        recordsPerDay
      });
    }
  }, [vacationMode, skipWeekends, skipHolidays, autoRun, recordsPerDay]);

  const handleConnect = () => {
    if (apiUrl.trim()) {
      localStorage.setItem('apiUrl', apiUrl.trim());
      setShowSetup(false);
      loadData();
    }
  };

  const handleProcessNow = async () => {
    if (!apiUrl) return;
    
    setIsProcessing(true);
    
    try {
      let response;
      
      try {
        response = await fetch(`${apiUrl}?action=processNow`, {
          method: 'POST',
          body: JSON.stringify({ recordsPerDay })
        });
      } catch (corsError) {
        const proxyUrl = 'https://corsproxy.io/?';
        response = await fetch(`${proxyUrl}${encodeURIComponent(apiUrl + '?action=processNow')}`, {
          method: 'POST',
          body: JSON.stringify({ recordsPerDay })
        });
      }
      
      const result = await response.json();
      
      if (result.success) {
        await loadData();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error processing:', error);
      alert('Error processing records. Check console for details.');
    }
    
    setIsProcessing(false);
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all records? This will start processing from the beginning.')) {
      return;
    }
    
    try {
      let response;
      
      try {
        response = await fetch(`${apiUrl}?action=resetAll`, {
          method: 'POST',
          body: JSON.stringify({})
        });
      } catch (corsError) {
        const proxyUrl = 'https://corsproxy.io/?';
        response = await fetch(`${proxyUrl}${encodeURIComponent(apiUrl + '?action=resetAll')}`, {
          method: 'POST',
          body: JSON.stringify({})
        });
      }
      
      const result = await response.json();
      
      if (result.success) {
        alert(result.message);
        await loadData();
      }
    } catch (error) {
      console.error('Error resetting:', error);
      alert('Error resetting records. Check console for details.');
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div style={{...styles.statCard, borderLeftColor: color}}>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );

  const Toggle = ({ label, checked, onChange, description }) => (
    <div style={styles.toggle}>
      <div style={{flex: 1}}>
        <p style={styles.toggleLabel}>{label}</p>
        {description && <p style={styles.toggleDesc}>{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          ...styles.toggleSwitch,
          background: checked ? '#2563EB' : '#D1D5DB'
        }}
      >
        <span style={{
          ...styles.toggleCircle,
          transform: checked ? 'translateX(28px)' : 'translateX(4px)'
        }} />
      </button>
    </div>
  );

  if (showSetup) {
    return (
      <div style={styles.setupContainer}>
        <div style={styles.setupCard}>
          <div style={{textAlign: 'center', marginBottom: '24px'}}>
            <Link style={{width: '64px', height: '64px', margin: '0 auto 16px', color: '#2563EB'}} />
            <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px'}}>Connect to Google Sheets</h2>
            <p style={{color: '#6B7280', fontSize: '14px'}}>Enter your Web App URL to get started</p>
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
              Web App URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              style={styles.input}
            />
            
            <button
              onClick={handleConnect}
              style={{...styles.button, ...styles.buttonPrimary}}
            >
              Connect
            </button>
            
            <div style={styles.infoBox}>
              <p style={{fontSize: '14px', color: '#374151', fontWeight: '500', marginBottom: '8px'}}>📋 Setup Instructions:</p>
              <ol style={{fontSize: '13px', color: '#6B7280', paddingLeft: '20px', margin: 0, lineHeight: '1.6'}}>
                <li>Open your Google Sheet</li>
                <li>Go to Extensions → Apps Script</li>
                <li>Paste the backend code</li>
                <li>Click Deploy → New deployment</li>
                <li>Choose "Web app"</li>
                <li>Set "Execute as: Me"</li>
                <li>Set "Who has access: Anyone"</li>
                <li>Copy the URL and paste it above</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = stats.total > 0 ? Math.round((stats.processed / stats.total) * 100) : 0;

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>Salesforce Task Queue</h1>
          <p style={styles.subtitle}>Automated Email Task Management</p>
        </div>

        <div style={{
          ...styles.connectionBadge,
          background: isConnected ? '#D1FAE5' : '#FEE2E2',
          color: isConnected ? '#065F46' : '#991B1B'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isConnected ? '#10B981' : '#EF4444'
          }} />
          <span>{isConnected ? 'Connected to Google Sheets' : 'Disconnected'}</span>
        </div>

        {vacationMode && (
          <div style={styles.alert}>
            <AlertCircle style={{width: '20px', height: '20px', color: '#F59E0B'}} />
            <p style={styles.alertText}>Vacation Mode Active - All processing paused</p>
          </div>
        )}

        <div style={styles.grid2}>
          <StatCard icon={BarChart3} label="Total Records" value={stats.total} color="#3B82F6" />
          <StatCard icon={CheckCircle} label="Processed" value={stats.processed} color="#10B981" />
          <StatCard icon={RefreshCw} label="Remaining" value={stats.remaining} color="#F59E0B" />
          <StatCard icon={Clock} label="Today" value={stats.processedToday} color="#8B5CF6" />
        </div>

        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
            <span style={{fontSize: '14px', fontWeight: '500', color: '#374151'}}>Progress</span>
            <span style={{fontSize: '14px', fontWeight: '500', color: '#374151'}}>{progressPercent}%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progressPercent}%`}} />
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{fontWeight: '600', color: '#1F2937', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Calendar style={{width: '20px', height: '20px', color: '#2563EB'}} />
            Schedule
          </h3>
          <div style={{fontSize: '14px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span style={{color: '#6B7280'}}>Last Run:</span>
              <span style={{fontWeight: '500', color: '#1F2937'}}>
                {stats.lastRun ? new Date(stats.lastRun).toLocaleString() : 'Never'}
              </span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span style={{color: '#6B7280'}}>Next Run:</span>
              <span style={{fontWeight: '500', color: '#1F2937'}}>{stats.nextRun || 'Not scheduled'}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: '#6B7280'}}>Records/Day:</span>
              <span style={{fontWeight: '500', color: '#1F2937'}}>{recordsPerDay}</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px'}}>
            Records Per Day: {recordsPerDay}
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={recordsPerDay}
            onChange={(e) => setRecordsPerDay(parseInt(e.target.value))}
            style={styles.slider}
          />
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginTop: '4px'}}>
            <span>50</span>
            <span>500</span>
          </div>
        </div>

        <div style={{marginBottom: '24px'}}>
          <Toggle
            label="Vacation Mode"
            description="Pause all processing while you're away"
            checked={vacationMode}
            onChange={setVacationMode}
          />
          <Toggle
            label="Auto-Run Daily"
            description="Automatically process records at 9 AM"
            checked={autoRun}
            onChange={setAutoRun}
          />
          <Toggle
            label="Skip Weekends"
            description="Don't process on Saturdays and Sundays"
            checked={skipWeekends}
            onChange={setSkipWeekends}
          />
          <Toggle
            label="Skip Canadian Holidays"
            description="Pause processing on statutory holidays"
            checked={skipHolidays}
            onChange={setSkipHolidays}
          />
        </div>

        <button
          onClick={handleProcessNow}
          disabled={isProcessing || vacationMode || stats.remaining === 0 || !isConnected}
          style={{
            ...styles.button,
            ...(isProcessing || vacationMode || stats.remaining === 0 || !isConnected
              ? styles.buttonDisabled
              : styles.buttonPrimary)
          }}
        >
          {isProcessing ? (
            <>
              <RefreshCw style={{width: '20px', height: '20px', animation: 'spin 1s linear infinite'}} />
              Processing...
            </>
          ) : (
            <>
              <Play style={{width: '20px', height: '20px'}} />
              Process Next {recordsPerDay} Records Now
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={!isConnected}
          style={{...styles.button, ...styles.buttonSecondary, opacity: !isConnected ? 0.5 : 1}}
        >
          <RefreshCw style={{width: '20px', height: '20px'}} />
          Reset All Records
        </button>

        <div style={{marginTop: '32px', textAlign: 'center', fontSize: '13px', color: '#6B7280'}}>
          <p>Connected to Google Sheets</p>
          <p style={{marginTop: '4px'}}>Tasks sync to Salesforce via Zapier</p>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SalesforceDashboard;