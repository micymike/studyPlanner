import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, ChevronDown, ChevronUp } from 'lucide-react';

export default function MobileResponsiveDemo() {
  const [expanded, setExpanded] = useState(false);

  const responsiveFeatures = [
    {
      title: 'Responsive Layout',
      description: 'The application layout adjusts based on screen size, ensuring optimal viewing on any device.',
      icon: <Monitor className="h-5 w-5 text-blue-600" />,
    },
    {
      title: 'Touch-Friendly Controls',
      description: 'All interactive elements are sized appropriately for touch input on mobile devices.',
      icon: <Smartphone className="h-5 w-5 text-green-600" />,
    },
    {
      title: 'Adaptive Content',
      description: 'Content and data visualization adapt to provide the best experience for each screen size.',
      icon: <Tablet className="h-5 w-5 text-purple-600" />,
    },
  ];

  // Detect current viewport size
  const getViewportSize = () => {
    if (typeof window === 'undefined') return 'Unknown';
    
    const width = window.innerWidth;
    if (width < 640) return 'Mobile';
    if (width < 1024) return 'Tablet';
    return 'Desktop';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-lg font-semibold flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
          Mobile Responsiveness
        </h2>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
      
      {expanded && (
        <div className="p-4 pt-0 border-t border-gray-100">
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              This application is designed to work seamlessly across all devices. 
              Resize your browser window to see how the layout adapts.
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md text-sm">
              <span className="font-medium">Current viewport:</span>{' '}
              <span className="text-blue-700">{getViewportSize()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {responsiveFeatures.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-3">
                <div className="flex items-center mb-2">
                  {feature.icon}
                  <h3 className="font-medium ml-2">{feature.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Responsive Breakpoints</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Device</th>
                    <th className="px-4 py-2 text-left">Breakpoint</th>
                    <th className="px-4 py-2 text-left">Class Prefix</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">Mobile</td>
                    <td className="px-4 py-2">&lt; 640px</td>
                    <td className="px-4 py-2"><code>sm:</code></td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Tablet</td>
                    <td className="px-4 py-2">&ge; 640px</td>
                    <td className="px-4 py-2"><code>md:</code></td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Desktop</td>
                    <td className="px-4 py-2">&ge; 1024px</td>
                    <td className="px-4 py-2"><code>lg:</code></td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Large Desktop</td>
                    <td className="px-4 py-2">&ge; 1280px</td>
                    <td className="px-4 py-2"><code>xl:</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Responsive Demo */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">Responsive Demo</h3>
            <div className="border border-gray-200 rounded-md p-4">
              <div className="hidden sm:block md:hidden">
                <div className="bg-blue-100 p-2 rounded text-center">
                  This content is only visible on small screens (sm)
                </div>
              </div>
              <div className="hidden md:block lg:hidden">
                <div className="bg-green-100 p-2 rounded text-center">
                  This content is only visible on medium screens (md)
                </div>
              </div>
              <div className="hidden lg:block xl:hidden">
                <div className="bg-yellow-100 p-2 rounded text-center">
                  This content is only visible on large screens (lg)
                </div>
              </div>
              <div className="hidden xl:block">
                <div className="bg-purple-100 p-2 rounded text-center">
                  This content is only visible on extra large screens (xl)
                </div>
              </div>
              <div className="block sm:hidden">
                <div className="bg-red-100 p-2 rounded text-center">
                  This content is only visible on mobile screens
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-gray-100 p-2 rounded text-center">
                    Item {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
