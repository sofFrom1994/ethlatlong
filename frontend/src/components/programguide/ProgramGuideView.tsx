/*

import { type Channel, type ProgramGuide } from "@prisma/client";
import dynamic from "next/dynamic";
import { type ChannelRowProps, LoadingChannelRow } from "./ChannelRow";
import { ProgramGuideMenu } from "./ProgramGuideMenu";

const DynamicChannelRow = dynamic<ChannelRowProps>(import('./ChannelRow'), {
  loading: () => <LoadingChannelRow/>,
  ssr: false,
})

const DynamicTimeBar = dynamic(import('./Timebar'), {
  loading: () => <div>loading timebar</div>,
  ssr: false,
})

interface ProgramGuideViewProps {
  guide: ProgramGuide;
  channels: Channel[];
  channelsLoading: boolean;
  start: Date;
  test?: boolean;
}
// todo create loading channel row to display instead of loading channels

export const ProgramGuideView = (props: ProgramGuideViewProps) => {
  const interval = 30;
  const daysAhead = 14;
  const end = new Date(props.start.getTime() + daysAhead * 1000 * 60 * 60 * 24);
  return (
    <div className="program-guide-container">
      <div className="program-guide">
        <DynamicTimeBar start={props.start} end={end} interval={interval} />
        <div className="channels">
          {props.channelsLoading ? (
            <div> loading channels </div>
          ) : (
            props.channels.map((channel) =>
              props.test ? (
                <DynamicChannelRow
                  key={channel.id}
                  interval={interval}
                  channel={channel}
                  start={props.start}
                  test={true}
                />
              ) : (
                <DynamicChannelRow
                  key={channel.id}
                  interval={interval}
                  channel={channel}
                  start={props.start}
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

*/