import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactRequestsService } from "../services/contact.service";
import { CreateContactRequestPayload } from "../types";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/http-client";

export function useContactRequests(pageIndex: number = 1, pageSize: number = 10, isRead?: boolean) {
  return useQuery({
    queryKey: ["contact-requests", pageIndex, pageSize, isRead],
    queryFn: () => contactRequestsService.getAll(pageIndex, pageSize, isRead),
  });
}

export function useContactRequestDetails(id: string) {
  return useQuery({
    queryKey: ["contact-requests", id],
    queryFn: () => contactRequestsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateContactRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateContactRequestPayload) => contactRequestsService.create(payload),
    onSuccess: (response) => {
      toast({
        className: "bg-gradient-to-br from-[#110508] to-[#050505] border border-[#C3143D]/30 text-white rounded-[1.5rem] shadow-[0_0_40px_rgba(195,20,61,0.2)]",
        title: "✨ Request Received Successfully",
        description: "Thank you for reaching out! Our creative team will review your inquiry and get back to you within 24 hours.",
        duration: 6000,
      });
    },
    onError: (error: any) => {
      let errorMessage = "An unexpected error occurred while sending your request. Please try again.";
      
      // If it's our ApiError class, extract the exact message from the backend
      if (error instanceof ApiError && (error as any).data) {
        // Backend typically returns message or errors object for validation
        if ((error as any).data.message) {
          errorMessage = (error as any).data.message;
        } else if ((error as any).data.errors) {
          // If it's a validation error object, try to format it
          const firstErrorKey = Object.keys((error as any).data.errors)[0];
          if (firstErrorKey && Array.isArray((error as any).data.errors[firstErrorKey])) {
            errorMessage = (error as any).data.errors[firstErrorKey][0];
          } else if (typeof (error as any).data.errors === 'string') {
            errorMessage = (error as any).data.errors;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        className: "bg-red-950/80 border border-red-500/30 text-white rounded-[1.5rem] backdrop-blur-md",
        title: "Action Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  });
}

export function useMarkContactRequestAsRead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => contactRequestsService.markAsRead(id),
    onSuccess: (response, variables) => {
      toast({
        title: "Success",
        description: response.message || "Marked as read successfully.",
      });
      // Invalidate the list and the specific item
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
      queryClient.invalidateQueries({ queryKey: ["contact-requests", variables] });
    },
    onError: (error: any) => {
      const errorMessage = error instanceof ApiError && (error as any).data?.message 
        ? (error as any).data.message 
        : "Failed to mark as read.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });
}
