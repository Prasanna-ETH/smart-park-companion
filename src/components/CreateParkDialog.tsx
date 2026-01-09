import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import api from '@/lib/api';
import { toast } from 'sonner';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    location: z.string().min(2, 'Location is required'),
    total_slots: z.coerce.number().min(1, 'At least 1 slot is required'),
    hourly_rate: z.coerce.number().min(1, 'Rate must be positive'),
    camera_rtsp_url: z.string().optional(),
});

interface CreateParkDialogProps {
    onParkCreated: () => void;
    trigger?: React.ReactNode;
}

const CreateParkDialog = ({ onParkCreated, trigger }: CreateParkDialogProps) => {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            location: '',
            total_slots: 10,
            hourly_rate: 50,
            camera_rtsp_url: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Mock latitude/longitude for now as backend requires it
            const payload = {
                ...values,
                latitude: 12.9716, // Bangalore mock
                longitude: 77.5946,
            };

            await api.post('/owner/parks', payload);
            toast.success('Parking lot created successfully');
            setOpen(false);
            form.reset();
            onParkCreated();
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to create parking lot');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Create Parking Lot</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Parking Lot</DialogTitle>
                    <DialogDescription>
                        Enter the details for your parking facility.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Park Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. City Center Mall" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Address or Area" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="total_slots"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Slots</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hourly_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hourly Rate (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="camera_rtsp_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>RTSP Camera URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="rtsp://admin:pass@ip:port/stream" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Create Park</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateParkDialog;
