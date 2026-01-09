import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, IndianRupee, Copy, ExternalLink } from 'lucide-react';
import StatCard from '@/components/StatCard';

const Payments = () => {
  const [amount, setAmount] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const { toast } = useToast();

  const generateLink = () => {
    if (!amount) {
      toast({
        title: 'Enter amount',
        description: 'Please specify the payment amount.',
        variant: 'destructive',
      });
      return;
    }
    const link = `https://smartpark.in/pay/${Date.now()}?amount=${amount}`;
    setGeneratedLink(link);
    toast({
      title: 'Payment link generated!',
      description: 'Share this link with your customer.',
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: 'Link copied!',
      description: 'Payment link copied to clipboard.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Manage payments and generate collection links</p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Today's Collection"
          value="₹4,250"
          icon={IndianRupee}
          trend={{ value: 15, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="This Week"
          value="₹28,400"
          icon={CreditCard}
          variant="default"
        />
        <StatCard
          title="This Month"
          value="₹1,12,500"
          icon={IndianRupee}
          variant="default"
        />
      </div>

      {/* Generate Payment Link */}
      <div className="max-w-lg rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Payment Link</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="amount"
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button onClick={generateLink} className="w-full">
            Generate Link
          </Button>

          {generatedLink && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-3 animate-scale-in">
              <Label className="text-sm">Payment Link</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={generatedLink}
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={copyLink}>
                  <Copy size={16} />
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={generatedLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} />
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Integrated with Razorpay & Stripe
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
