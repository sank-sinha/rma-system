import React from 'react';
import { BarChart3, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle, Users, Package } from 'lucide-react';
import { TestResult, RMARecord, DashboardStats } from '../types';

interface DashboardProps {
  testResults: TestResult[];
  rmaData: RMARecord[];
}

export function Dashboard({ testResults, rmaData }: DashboardProps) {
  const calculateStats = (): DashboardStats => {
    // Count total forms = rows with customer names in "Name on the invoice" column
    const totalForms = rmaData.filter(rma => rma.customerName && rma.customerName.trim() !== '').length;
    
    console.log('=== DASHBOARD DEBUG ===');
    console.log('Total RMA records loaded:', rmaData.length);
    console.log('Total form submissions:', totalForms);
    console.log('Test results submitted:', testResults.length);
    
    // Initialize counters
    let pendingTests = 0;
    let moreTestingRequired = 0; // from CSV "testing" + form submissions
    let physicalDamage = 0; // from CSV "Physical damage" + form submissions  
    let noIssuesFound = 0; // from CSV "No Issue" + form submissions
    let replacements = 0; // from CSV "Replace" + form submissions
    
    // Count from CSV data - only count each RMA once
    rmaData.forEach(rma => {
      const originalStatus = rma.originalStatus || '';
      console.log(`RMA ${rma.rmaNumber}: RMA Status = "${originalStatus}"`);
      
      // Check if this RMA has been tested via form (overrides CSV status)
      const hasFormResult = testResults.some(result => result.rmaNumber === rma.rmaNumber);
      
      if (!hasFormResult) {
        // Use CSV status since no form result exists
        const statusTrimmed = originalStatus.trim();
        
        if (statusTrimmed === '') {
          pendingTests++;
          console.log(`  → Counted as PENDING TEST (RMA Status blank)`);
        } else if (statusTrimmed === 'Replace') {
          replacements++;
          console.log(`  → REPLACEMENT (from CSV)`);
        } else if (statusTrimmed === 'No Issue') {
          noIssuesFound++;
          console.log(`  → NO ISSUES (from CSV)`);
        } else if (statusTrimmed === 'testing') {
          moreTestingRequired++;
          console.log(`  → MORE TESTING (from CSV)`);
        } else if (statusTrimmed === 'Physical damage') {
          physicalDamage++;
          console.log(`  → PHYSICAL DAMAGE (from CSV)`);
        } else if (statusTrimmed === 'Repaired' || statusTrimmed === 'Upgraded') {
          // These are resolved but don't count in our main categories
          console.log(`  → RESOLVED (${statusTrimmed}) - not counted`);
        } else {
          console.log(`  → Unknown status "${statusTrimmed}"`);
        }
      } else {
        console.log(`  → Has form result, skipping CSV status`);
      }
    });
        
    // Add counts from form submissions (these override CSV)
    testResults.forEach(result => {
      console.log(`Form result ${result.rmaNumber}: ${result.testingStatus}`);
      switch (result.testingStatus) {
        case 'More testing needed':
          moreTestingRequired++;
          console.log(`  → MORE TESTING (from form)`);
          break;
        case 'Physical Damage':
          physicalDamage++;
          console.log(`  → PHYSICAL DAMAGE (from form)`);
          break;
        case 'No issues found':
          noIssuesFound++;
          console.log(`  → NO ISSUES (from form)`);
          break;
        case 'Replacement':
          replacements++;
          console.log(`  → REPLACEMENT (from form)`);
          break;
      }
    });
    
    const completedTests = testResults.length;
    const unresolved = pendingTests; // Only truly pending items

    console.log('=== FINAL DASHBOARD COUNTS ===');
    console.log('Total Forms:', totalForms);
    console.log('Pending Tests:', pendingTests);
    console.log('More Testing Required:', moreTestingRequired);
    console.log('Physical Damage:', physicalDamage);
    console.log('No Issues Found:', noIssuesFound);
    console.log('Replacements:', replacements);
    console.log('Completed Tests (form):', completedTests);
    console.log('Unresolved (pending tests only):', unresolved);
    console.log('===================');
    // Calculate average resolution time (mock calculation)
    const averageResolutionTime = testResults.length > 0 ? 
      Math.round(testResults.reduce((acc, result) => {
        const testDate = new Date(result.dateTested);
        const orderDate = result.dateOrdered ? new Date(result.dateOrdered) : testDate;
        const diffTime = Math.abs(testDate.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
      }, 0) / testResults.length) : 0;

    return {
      totalForms,
      totalReturns: totalForms,
      unresolved,
      physicalDamage,
      moreTestingRequired,
      noIssuesFound,
      replacements,
      averageResolutionTime,
      pendingTests,
      completedTests
    };
  };

  const stats = calculateStats();

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: number | string;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className="glass-effect rounded-2xl p-6 border border-purple-100/50 shadow-elegant hover:shadow-xl transition-smooth">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-2xl ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="glass-effect rounded-2xl shadow-elegant border border-purple-100/50 p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 gradient-bg rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-gray-600 text-lg">Real-time insights into your RMA testing process</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Form Submissions"
            value={stats.totalForms}
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            subtitle="Customer returns submitted"
          />
          <StatCard
            title="Tests Completed"
            value={stats.completedTests}
            icon={CheckCircle}
            color="bg-gradient-to-br from-green-500 to-green-600"
            subtitle="RMAs processed"
          />
          <StatCard
            title="Pending Tests"
            value={stats.pendingTests}
            icon={Clock}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            subtitle="Awaiting testing"
          />
          <StatCard
            title="Avg Resolution Time"
            value={`${stats.averageResolutionTime} days`}
            icon={TrendingUp}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            subtitle="Time to resolve"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="More Testing Needed"
            value={stats.moreTestingRequired}
            icon={Clock}
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
          />
          <StatCard
            title="Replacements"
            value={stats.replacements}
            icon={XCircle}
            color="bg-gradient-to-br from-red-500 to-red-600"
          />
          <StatCard
            title="No Issues Found"
            value={stats.noIssuesFound}
            icon={CheckCircle}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          <StatCard
            title="Physical Damage"
            value={stats.physicalDamage}
            icon={AlertTriangle}
            color="bg-gradient-to-br from-orange-500 to-red-500"
          />
        </div>
      </div>

      <div className="glass-effect rounded-2xl shadow-elegant border border-purple-100/50 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Insights</h3>
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-semibold text-green-800">Live Database Connection</p>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Data is automatically synced across all users in real-time
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Resolution Rate</h4>
            <p className="text-2xl font-bold text-blue-800">
              {stats.totalForms > 0 ? Math.round((stats.completedTests / stats.totalForms) * 100) : 0}%
            </p>
            <p className="text-sm text-blue-700">of submitted RMAs tested</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Success Rate</h4>
            <p className="text-2xl font-bold text-green-800">
              {stats.completedTests > 0 ? Math.round((stats.noIssuesFound / stats.completedTests) * 100) : 0}%
            </p>
            <p className="text-sm text-green-700">no issues found</p>
          </div>
        </div>
      </div>
    </div>
  );
}