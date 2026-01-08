import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Shield,
  Loader2,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  DollarSign,
  FileCheck,
  Eye,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CaseData {
  id: string;
  token: string;
  email: string;
  name: string;
  phone: string | null;
  platform: string;
  service: string;
  tier: string;
  status: string;
  payment_proof_url: string | null;
  authorization_code: string | null;
  code_verified: boolean | null;
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pending Payment', color: 'bg-yellow-500' },
  { value: 'payment_uploaded', label: 'Payment Uploaded', color: 'bg-blue-500' },
  { value: 'payment_verified', label: 'Payment Verified', color: 'bg-purple-500' },
  { value: 'service_in_progress', label: 'In Progress', color: 'bg-cyan-500' },
  { value: 'account_review', label: 'Account Review', color: 'bg-orange-500' },
  { value: 'finalization', label: 'Finalization', color: 'bg-pink-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    filterCases();
  }, [cases, searchQuery, statusFilter]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/admin/login');
      return;
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      toast.error('Admin access required');
      await supabase.auth.signOut();
      navigate('/admin/login');
      return;
    }

    fetchCases();
  };

  const fetchCases = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases');
    } else {
      setCases(data || []);
    }
    setIsLoading(false);
  };

  const filterCases = () => {
    let filtered = [...cases];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.platform.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredCases(filtered);
  };

  const handleStatusChange = async (caseId: string, newStatus: string) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from('cases')
      .update({ status: newStatus })
      .eq('id', caseId);

    if (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } else {
      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
      );
      if (selectedCase?.id === caseId) {
        setSelectedCase((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      toast.success('Status updated');
    }
    setIsUpdating(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((s) => s.value === status);
    return (
      <Badge className={`${statusOption?.color || 'bg-gray-500'} text-white`}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const stats = {
    total: cases.length,
    pending: cases.filter((c) => c.status === 'pending_payment').length,
    inProgress: cases.filter((c) =>
      ['payment_uploaded', 'payment_verified', 'service_in_progress', 'account_review', 'finalization'].includes(c.status)
    ).length,
    completed: cases.filter((c) => c.status === 'completed').length,
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-20 md:py-28">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 mb-4">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Admin Dashboard</span>
              </div>
              <h1 className="text-3xl font-bold">Case Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={fetchCases}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.inProgress}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, platform..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cases Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Cases ({filteredCases.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCases.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No cases found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCases.map((caseItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell className="font-mono text-xs">
                            {caseItem.id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{caseItem.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {caseItem.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{caseItem.platform}</TableCell>
                          <TableCell className="max-w-32 truncate">
                            {caseItem.service}
                          </TableCell>
                          <TableCell>{caseItem.tier}</TableCell>
                          <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                          <TableCell>
                            {caseItem.payment_proof_url ? (
                              <a
                                href={caseItem.payment_proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline inline-flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(caseItem.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCase(caseItem)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Case Detail Modal */}
      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Case Details</DialogTitle>
          </DialogHeader>
          {selectedCase && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Case ID</p>
                  <p className="font-mono">{selectedCase.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Token</p>
                  <p className="font-mono text-xs break-all">{selectedCase.token}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{selectedCase.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{selectedCase.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{selectedCase.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Platform</p>
                  <p>{selectedCase.platform}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p>{selectedCase.service}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tier</p>
                  <p>{selectedCase.tier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Auth Code</p>
                  <p className="font-mono">{selectedCase.authorization_code || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Code Verified</p>
                  <p>{selectedCase.code_verified ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {selectedCase.payment_proof_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Proof</p>
                  <a
                    href={selectedCase.payment_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={selectedCase.payment_proof_url}
                      alt="Payment proof"
                      className="max-h-48 rounded-lg border border-border"
                    />
                  </a>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                <Select
                  value={selectedCase.status}
                  onValueChange={(value) =>
                    handleStatusChange(selectedCase.id, value)
                  }
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <a
                  href={`/case/${selectedCase.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Customer Dashboard
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
