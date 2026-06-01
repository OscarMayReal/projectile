import { NativeTabs } from "expo-router/build/native-tabs";

export default function IndexLayout() {
  return (
    <NativeTabs sidebarAdaptable labelVisibilityMode={"labeled"}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon 
            md={{ default: "home", selected: "home" }}
            sf={{ default: "house", selected: "house.fill" }}
        />
        <NativeTabs.Trigger.Label>Feed</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="boards">
        <NativeTabs.Trigger.Icon 
            md={{ default: "view_list", selected: "view_list" }}
            sf={{ default: "list.bullet", selected: "list.bullet" }}
        />
        <NativeTabs.Trigger.Label>Boards</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="reports">
        <NativeTabs.Trigger.Icon 
            md={{ default: "bar_chart", selected: "bar_chart" }}
            sf={{ default: "chart.bar", selected: "chart.bar.fill" }}
        />
        <NativeTabs.Trigger.Label>Reports</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="admin">
        <NativeTabs.Trigger.Icon 
            md={{ default: "settings", selected: "settings" }}
            sf={{ default: "gear.circle", selected: "gear.circle.fill" }}
        />
        <NativeTabs.Trigger.Label>Admin</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Icon 
            md={{ default: "search", selected: "search" }}
            sf={{ default: "magnifyingglass", selected: "magnifyingglass" }}
        />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}