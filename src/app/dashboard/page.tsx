'use client';

import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'title' | 'id'>('title');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/auth');
      }
    };
    checkAuth();
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/posts'
      );
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        setPosts(response.data);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter((post) => {
      if (filterType === 'title') {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return post.id.toString().includes(searchTerm);
      }
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterType, posts]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const logoutFunction = () => {
    localStorage.removeItem('auth_token');
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card className='mx-7  mt-[5%] bg-[#0f0f0f]'>
        <CardHeader className='flex justify-between'>
          <p className='font-serif  text-3xl text-cyan-700'>Dashboard</p>
          <DropdownMenu>
            <DropdownMenuTrigger className='font-serif cursor-pointer text-slate-300 border-2 rounded px-5.5 py-2'>
              Profile
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className='font-serif text-slate-300'>
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logoutFunction();
                }}
                className='font-serif text-slate-300'
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-1 items-center gap-2'>
              <Input
                placeholder='Search...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='max-w-xs font-serif text-slate-300'
              />
              <Select
                value={filterType}
                onValueChange={(value) =>
                  setFilterType(value as 'title' | 'id')
                }
              >
                <SelectTrigger className='w-32 bg-amber-50'>
                  <SelectValue
                    placeholder='Filter by'
                    className='text-slate-300'
                  />
                </SelectTrigger>
                <SelectContent className='bg-[#706666]'>
                  <SelectItem
                    value='title'
                    className='font-serif text-slate-300'
                  >
                    Title
                  </SelectItem>
                  <SelectItem value='id' className='font-serif text-slate-300'>
                    ID
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='text-sm text-muted-foreground'>
              Showing {indexOfFirstPost + 1}-
              {Math.min(indexOfLastPost, filteredPosts.length)} of{' '}
              {filteredPosts.length} posts
            </div>
          </div>
          <div className='sm:mt-7 mt-3 flex flex-wrap sm:justify-between justify-normal items-center sm:gap-0 gap-3.5'>
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => {
                return (
                  <div key={post.id}>
                    <Card className='sm:w-[220px] w-full sm:h-[400px] h-[300px] overflow-y-hidden bg-[#333] mb-2'>
                      <CardHeader>
                        <div className='border-2 rounded-[50%] w-[30px] h-[30px] flex justify-center items-center bg-[#1f3e6d] text-slate-300 '>
                          {post.id}
                        </div>
                        <p className='text-slate-300 text-[.8rem] font-serif'>
                          {post.title}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className='text-slate-300 text-[1rem] font-serif'>
                          {post.body}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            ) : (
              <Card className='sm:w-full sm:h-[400px] h-[300px] overflow-scroll flex justify-center items-center'>
                <CardContent className='font-serif text-3xl'>
                  No Data found
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className=' font-serif'
                />
              </PaginationItem>
              <div className='flex flex-wrap'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                          className='cursor-pointer '
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}
              </div>

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className=' font-serif'
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Card>
    </>
  );
};

export default Dashboard;
