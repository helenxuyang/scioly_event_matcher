import AssignmentsTable from "AssignmentsTable";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

export const TableTabs = () => {
  return <Tabs>
    <TabList>
      <Tab>Div B</Tab>
      <Tab>Div C</Tab>
    </TabList>
    <TabPanel>
      <AssignmentsTable division="B" />
    </TabPanel>
    <TabPanel>
      <AssignmentsTable division="C" />
    </TabPanel>
  </Tabs>
}