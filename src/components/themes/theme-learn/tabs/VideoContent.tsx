
import React from 'react';
import { Theme } from '../../hooks/useThemeDetail';

interface VideoContentProps {
  theme: Theme;
  videoId: string | null;
  contentHasEmbeddedVideo: (content?: string) => boolean;
}

const VideoContent: React.FC<VideoContentProps> = ({ theme, videoId, contentHasEmbeddedVideo }) => {
  return (
    <>
      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
        <iframe 
          className="w-full h-[450px]"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={theme.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      {contentHasEmbeddedVideo(theme.content) && theme.content && (
        <div className="mt-8 prose prose-lg max-w-none">
          <h3 className="text-xl font-semibold mb-4">Տեսանյութի նկարագրություն</h3>
          <div dangerouslySetInnerHTML={{ __html: theme.content.replace(/<iframe.*?<\/iframe>/g, '') }} />
        </div>
      )}
    </>
  );
};

export default VideoContent;
