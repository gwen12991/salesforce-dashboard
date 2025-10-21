
import React, { useState, useEffect } from 'react';
import { Power, Calendar, Clock, RefreshCw, Play, Pause, Settings, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';

const SalesforceDashboard = () => {
  const [vacationMode, setVacationMode] = useState(false);
  const [skipWeekends, setSkipWeekends] = useState(true);
  const [skipHolidays, setSkipHolidays] = useState(true);
  const [autoRun, setAutoRun] = useState(true);
  const [recordsPerDay, setRecordsPerDay] = useState(150);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    total: 2327,
    processed: 0,
    remaining: 2327,
    lastRun: null,
    nextRun: null,
    processedToday: 0
  });

  // Simulated stats update
  useEffect(() => {
    const updateStats = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      setStats(prev => ({
        ...prev,
        nextRun: autoRun && !vacationMode ? tomorrow.toLocaleString() : 'Paused'
      }));
    };
    updateStats();
  }, [autoRun, vacationMode]);

  const handleProcessNow = async () => {
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStats(prev => ({
      ...prev,
      processed: prev.processed + recordsPerDay,
      remaining: Math.max(0, prev.remaining - recordsPerDay),
      processedToday: recordsPerDay,
      lastRun: new Date().toLocaleString()
    }));
    
    setIsProcessing(false);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all records? This will start processing from the beginning.')) {
      setStats({
        total: 2327,
        processed: 0,
        remaining: 2327,
        lastRun: null,
        nextRun: stats.nextRun,
        processedToday: 0
      });
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <Icon className="w-8 h-8 opacity-20" style={{ color }} />
      </div>
    </div>
  );

  const Toggle = ({ label, checked, onChange, description }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="font-medium text-gray-800">{label}</p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const progressPercent = Math.round((stats.processed / stats.total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Salesforce Task Queue</h1>
          <p className="text-gray-600">Automated Email Task Management</p>
        </div>

        {/* Status Banner */}
        {vacationMode && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-700 mr-3" />
              <p className="text-yellow-700 font-medium">Vacation Mode Active - All processing paused</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon={BarChart3} label="Total Records" value={stats.total} color="#3b82f6" />
          <StatCard icon={CheckCircle} label="Processed" value={stats.processed} color="#10b981" />
          <StatCard icon={RefreshCw} label="Remaining" value={stats.remaining} color="#f59e0b" />
          <StatCard icon={Clock} label="Today" value={stats.processedToday} color="#8b5cf6" />
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Schedule Info */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Schedule
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Last Run:</span>
              <span className="font-medium text-gray-800">{stats.lastRun || 'Never'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Next Run:</span>
              <span className="font-medium text-gray-800">{stats.nextRun || 'Not scheduled'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Records/Day:</span>
              <span className="font-medium text-gray-800">{recordsPerDay}</span>
            </div>
          </div>
        </div>

        {/* Records Per Day Slider */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Records Per Day: {recordsPerDay}
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={recordsPerDay}
            onChange={(e) => setRecordsPerDay(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50</span>
            <span>500</span>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="space-y-3 mb-6">
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

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleProcessNow}
            disabled={isProcessing || vacationMode || stats.remaining === 0}
            className={`w-full py-4 rounded-lg font-semibold text-white shadow-lg transition-all flex items-center justify-center ${
              isProcessing || vacationMode || stats.remaining === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Process Next {recordsPerDay} Records Now
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset All Records
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Connected to Google Sheets</p>
          <p className="mt-1">Tasks sync to Salesforce via Zapier</p>
        </div>
      </div>
    </div>
  );
};

export default SalesforceDashboard;