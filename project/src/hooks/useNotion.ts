import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotionClient } from '../lib/notion';
import toast from 'react-hot-toast';

const notionClient = new NotionClient();

export function useNotion(token: string) {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (token && token.startsWith('secret_')) {
      try {
        notionClient.initialize(token);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Notion client:', error);
        setIsInitialized(false);
      }
    } else {
      setIsInitialized(false);
    }
  }, [token]);

  const { data: databases, isLoading: isLoadingDatabases } = useQuery({
    queryKey: ['databases', token],
    queryFn: () => notionClient.listDatabases(),
    enabled: !!token && isInitialized && token.startsWith('secret_'),
    retry: 1,
    onError: (error) => {
      console.error('Database fetch error:', error);
      toast.error('Failed to fetch databases. Please check your token.');
    },
  });

  const validateTokenMutation = useMutation({
    mutationFn: () => notionClient.validateToken(),
    onSuccess: (isValid) => {
      if (isValid) {
        toast.success('Notion token validated successfully');
        queryClient.invalidateQueries({ queryKey: ['databases'] });
      } else {
        toast.error('Invalid Notion token');
      }
    },
    onError: (error) => {
      console.error('Validation error:', error);
      toast.error('Failed to validate Notion token');
    },
  });

  const createPageMutation = useMutation({
    mutationFn: ({ databaseId, properties }: { databaseId: string; properties: any }) =>
      notionClient.createPage(databaseId, properties),
    onSuccess: () => {
      toast.success('Page created successfully');
      queryClient.invalidateQueries({ queryKey: ['databases'] });
    },
    onError: (error) => {
      console.error('Page creation error:', error);
      toast.error('Failed to create page');
    },
  });

  return {
    databases,
    isLoadingDatabases,
    validateToken: () => validateTokenMutation.mutate(),
    isValidating: validateTokenMutation.isPending,
    createPage: createPageMutation.mutate,
    isCreating: createPageMutation.isPending,
  };
}