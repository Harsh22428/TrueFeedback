'use client'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import messages from "@/app/(app)/messages.json"
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link';

export default function Home() {
  {/* Main content */}
      
  return (
       <>
      <div className="h-screen w-full overflow-y-auto flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-32 py-16 min-h-0">
        <section className="text-center text-white mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2025 True Feedback. All rights reserved.
        <br />
      <a className="cursor-pointer text-blue-500 hover:text-shadow-blue-600" href="https://github.com/Harsh22428">Created By Harsh Sharma </a>
      </footer>
      </div>
    </>
  );
}