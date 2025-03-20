import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Cloud, Database, Globe, Key, Lock, Moon, Save, Sun, UserCog } from "lucide-react";

const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("account");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dataRetention, setDataRetention] = useState("90");
  
  const handleSave = () => {
    toast.success(t('changes.saved'));
  };
  
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar isOpen={true} />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={() => console.log("Toggle sidebar")} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">{t('settings')}</h1>
              
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('account.information').split(' ')[0]}</span>
                  </TabsTrigger>
                  <TabsTrigger value="language" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('language')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('appearance')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('security.settings').split(' ')[0]}</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('data.management').split(' ')[0]}</span>
                  </TabsTrigger>
                  <TabsTrigger value="api" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <span className="hidden sm:inline">API</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="account" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('account.information')}</CardTitle>
                      <CardDescription>
                        {t('update.account.details')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" defaultValue="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue="john.doe@example.com" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Job Title</Label>
                          <Input id="title" defaultValue="HR Manager" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select defaultValue="hr">
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Select Department</SelectItem>
                              <SelectItem value="hr">Human Resources</SelectItem>
                              <SelectItem value="engineering">Engineering</SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="product">Product</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notifications" className="flex items-center gap-2">
                            <span>Email Notifications</span>
                          </Label>
                          <Switch 
                            id="notifications" 
                            checked={emailNotifications} 
                            onCheckedChange={setEmailNotifications} 
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications about occupancy changes and reports
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="w-full sm:w-auto" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        {t('save.changes')}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="language" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('language')}</CardTitle>
                      <CardDescription>
                        Choose your preferred language
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language-select">Display Language</Label>
                        <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'fr')}>
                          <SelectTrigger id="language-select">
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">{t('english')}</SelectItem>
                            <SelectItem value="fr">{t('french')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-2">
                          This will change the language across the entire application
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="w-full sm:w-auto" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        {t('save.changes')}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('appearance')}</CardTitle>
                      <CardDescription>
                        {t('customize.dashboard')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="theme-mode" className="flex items-center gap-2">
                            <span>Dark Mode</span>
                          </Label>
                          <Switch 
                            id="theme-mode" 
                            checked={darkMode} 
                            onCheckedChange={setDarkMode} 
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Toggle between light and dark theme
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Chart Colors</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <div className="w-full h-8 bg-primary rounded-md"></div>
                            <p className="text-xs text-center">Primary</p>
                          </div>
                          <div className="space-y-2">
                            <div className="w-full h-8 bg-success rounded-md"></div>
                            <p className="text-xs text-center">Success</p>
                          </div>
                          <div className="space-y-2">
                            <div className="w-full h-8 bg-warning rounded-md"></div>
                            <p className="text-xs text-center">Warning</p>
                          </div>
                          <div className="space-y-2">
                            <div className="w-full h-8 bg-danger rounded-md"></div>
                            <p className="text-xs text-center">Danger</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="w-full sm:w-auto" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        {t('save.changes')}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('security.settings')}</CardTitle>
                      <CardDescription>
                        {t('manage.password.security')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Two-Factor Authentication</Label>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Enable 2FA</p>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="w-full sm:w-auto" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        {t('save.changes')}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="data" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('data.management')}</CardTitle>
                      <CardDescription>
                        {t('configure.data.storage')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="data-retention">Data Retention Period</Label>
                        <Select value={dataRetention} onValueChange={setDataRetention}>
                          <SelectTrigger id="data-retention">
                            <SelectValue placeholder="Select Period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                            <SelectItem value="180">180 Days</SelectItem>
                            <SelectItem value="365">1 Year</SelectItem>
                            <SelectItem value="730">2 Years</SelectItem>
                            <SelectItem value="forever">Forever</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Historical occupancy data will be kept for this period
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Data Backup</Label>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Auto Backup</p>
                            <p className="text-sm text-muted-foreground">
                              Automatically backup your data daily
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline">
                          <Database className="mr-2 h-4 w-4" />
                          Export All Data
                        </Button>
                        <Button variant="outline" className="text-danger hover:text-danger">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Delete All Data
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="w-full sm:w-auto" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        {t('save.changes')}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="api" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('api.access')}</CardTitle>
                      <CardDescription>
                        {t('manage.api.keys')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <div className="flex">
                          <Input
                            id="api-key"
                            value="••••••••••••••••••••••••••••••"
                            readOnly
                            className="rounded-r-none"
                          />
                          <Button 
                            className="rounded-l-none" 
                            onClick={() => {
                              toast.success("API key copied to clipboard");
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Use this key to access the API programmatically
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>Integrations</Label>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Cloud className="h-5 w-5 text-blue-500" />
                              <div>
                                <p className="text-sm font-medium">Notion Integration</p>
                                <p className="text-xs text-muted-foreground">
                                  Connect to your Notion workspace
                                </p>
                              </div>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Cloud className="h-5 w-5 text-green-500" />
                              <div>
                                <p className="text-sm font-medium">Google Sheets</p>
                                <p className="text-xs text-muted-foreground">
                                  Import/export data with Google Sheets
                                </p>
                              </div>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="w-full sm:w-auto" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        {t('save.changes')}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SettingsPage;
