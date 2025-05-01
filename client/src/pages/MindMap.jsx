import { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
  ReactFlowProvider,
} from 'react-flow-renderer';
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

const getNodeStyle = (type) => ({
  padding: "20px",
  borderRadius: "12px",
  minWidth: "200px",
  fontFamily: "Inter, sans-serif",
  ...getNodeTypeStyles(type),
});

const getNodeTypeStyles = (type) => {
  switch (type) {
    case "main":
      return {
        background: "#FFFFFF",
        border: "3px solid #FF5733",
        color: "#333333",
        fontWeight: "700",
        fontSize: "22px",
        minWidth: "300px",
        boxShadow: "0 0 20px rgba(255, 87, 51, 0.3)",
      };
    case "subtopic":
      return {
        background: "#FFC300",
        border: "2px solid #DAA520",
        color: "#000000",
        fontWeight: "600",
        fontSize: "18px",
        boxShadow: "0 0 15px rgba(255, 195, 0, 0.2)",
      };
    default:
      return {
        background: "#00FF9D",
        border: "2px solid #008F5E",
        color: "#000000",
        fontWeight: "500",
        boxShadow: "0 0 10px rgba(0, 255, 157, 0.1)",
      };
  }
};

const edgeStyles = {
  main: {
    strokeWidth: 3,
    stroke: "#FF5733",
    animated: true,
  },
  detail: {
    strokeWidth: 2,
    stroke: "#FFC300",
  },
};

const initialNodes = [{
  id: 'placeholder',
  type: 'default',
  data: { label: '🎯 Click Generate to create mind map' },
  position: { x: 400, y: 200 },
  style: getNodeStyle('main'),
}];

const MindMapContent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fitView, setViewport } = useReactFlow();
  
  // Get URL directly from window.location
  const urlParams = new URLSearchParams(window.location.search);
  const videoUrl = urlParams.get('url');

  const fetchMindMap = async () => {
    try {
      setLoading(true);
      
      if (!videoUrl) {
        throw new Error("No video URL provided");
      }

      const decodedUrl = decodeURIComponent(videoUrl);
      console.log("Making API call with URL:", decodedUrl);

      const response = await axios.get(
        `http://127.0.0.1:5001/generate_mind_map?video_url=${videoUrl}`
      );

      // Extract the JSON string from the error message
      let mindMap;
      if (response.data.error && response.data.error.includes('{')) {
        const jsonStr = response.data.error.split('JSON format:')[1];
        mindMap = JSON.parse(jsonStr);
      } else {
        mindMap = response.data;
      }

      if (!mindMap.topic || !mindMap.subtopics) {
        throw new Error("Invalid API Response");
      }

      const centerX = window.innerWidth / 2 - 150;
      
      const mainNode = {
        id: "main",
        type: "default",
        data: { label: `🎯 ${mindMap.topic}` },
        position: { x: centerX, y: 100 },
        style: getNodeStyle('main'),
      };

      const newNodes = [mainNode];
      const newEdges = [];
      let yOffset = 250;

      mindMap.subtopics.forEach((subtopic, index) => {
        const subtopicId = `subtopic-${index}`;
        const emojis = ['💡', '🔍', '📊', '🎯', '💪', '🚀', '📈', '🎨'];
        const emoji = emojis[index % emojis.length];

        newNodes.push({
          id: subtopicId,
          type: "default",
          data: { label: `${emoji} ${subtopic.name}` },
          position: { x: centerX, y: yOffset },
          style: getNodeStyle('subtopic'),
        });

        newEdges.push({
          id: `edge-to-${subtopicId}`,
          source: "main",
          target: subtopicId,
          type: "smoothstep",
          style: edgeStyles.main,
        });

        const detailSpacing = 400;
        subtopic.details.forEach((detail, detailIndex) => {
          const detailId = `${subtopicId}-detail-${detailIndex}`;
          const xOffset = detailIndex % 2 === 0 ? -detailSpacing : detailSpacing;
          
          newNodes.push({
            id: detailId,
            type: "default",
            data: { label: detail },
            position: { 
              x: centerX + xOffset,
              y: yOffset + (Math.floor(detailIndex / 2) * 100)
            },
            style: getNodeStyle('detail'),
          });

          newEdges.push({
            id: `edge-to-${detailId}`,
            source: subtopicId,
            target: detailId,
            type: "smoothstep",
            style: edgeStyles.detail,
          });
        });

        yOffset += Math.max(Math.ceil(subtopic.details.length / 2) * 150 + 100, 250);
      });

      setNodes(newNodes);
      setEdges(newEdges);

      setTimeout(() => {
        setViewport({ x: 0, y: 0, zoom: 0.65 });
        fitView({ padding: 100, duration: 800 });
      }, 100);

    } catch (error) {
      console.error("Error:", error);
      setNodes([{
        id: 'error',
        type: 'default',
        data: { label: `❌ Error: ${error.message}` },
        position: { x: window.innerWidth / 2 - 150, y: 200 },
        style: getNodeStyle('main'),
      }]);
      setEdges([]);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect with proper dependency array to prevent duplicate calls
  useEffect(() => {
    if (videoUrl && !loading) {  // Add loading check to prevent duplicate calls
      fetchMindMap();
    }
  }, [videoUrl]); // Remove loading from dependency array

  useEffect(() => {
    const handleResize = () => {
      if (nodes.length > 0) {
        fitView({ padding: 50, duration: 800 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [nodes, fitView]);

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            Mind<span className="text-[#00FF9D]">Map</span>
          </h1>
          <p className="text-xl text-gray-400">
            Visualize your learning with AI-powered mind maps
          </p>
        </div>

        <Card className="bg-black/40 backdrop-blur-md border border-white/10 p-6">
          <div className="flex justify-center">
            <Button
              onClick={fetchMindMap}
              disabled={loading}
              className="px-8 bg-[#00FF9D]/20 text-[#00FF9D] hover:bg-[#00FF9D]/30 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                '✨ Generate Mind Map'
              )}
            </Button>
          </div>

          <div className="mt-6 h-[70vh] rounded-xl overflow-hidden border border-white/10">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              minZoom={0.3}
              maxZoom={2}
              defaultviewport={{ x: 0, y: 0, zoom: 0.8 }}
              fitViewOptions={{ padding: 50, duration: 800 }}
            >
              <Background
                color="#1a1a1a"
                gap={24}
                size={1.5}
                className="bg-black/50"
              />
              <Controls className="bg-black/50 border border-white/10 rounded-lg p-2" />
              <div className="text-sm text-gray-400 bg-black/50 backdrop-blur-md 
                border border-white/10 rounded-lg px-4 py-2">
                Use mouse wheel to zoom • Drag to pan
              </div>
            </ReactFlow>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Wrapper component that provides necessary context
const MindMap = () => {
  return (
    <ReactFlowProvider>
      <MindMapContent />
    </ReactFlowProvider>
  );
};

export default MindMap;