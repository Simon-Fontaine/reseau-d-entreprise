import {
  Container,
  Page,
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription
} from "@/components/layouts/page";
import Image from 'next/image';

const teammembers = [
  {
    "name" : "Tristan",
    "LinkPicture" : "/image/tristan.jpg"
  },
  {
    "name" : "Bastien",
    "LinkPicture" : "/image/bastien.jpg"
  },
  {
    "name" : "Tristan",
    "LinkPicture" : "/image/tristan.jpg"
  },
  {
    "name" : "Bastien",
    "LinkPicture" : "/image/bastien.jpg"
  },
    {
    "name" : "Tristan",
    "LinkPicture" : "/image/tristan.jpg"
  },
  {
    "name" : "Bastien",
    "LinkPicture" : "/image/bastien.jpg"
  },
    {
    "name" : "Tristan",
    "LinkPicture" : "/image/tristan.jpg"
  },
  {
    "name" : "Bastien",
    "LinkPicture" : "/image/bastien.jpg"
  },
    {
    "name" : "Tristan",
    "LinkPicture" : "/image/tristan.jpg"
  },
  {
    "name" : "Bastien",
    "LinkPicture" : "/image/bastien.jpg"
  }
]
export default function AboutPage() {
  return (
    <Page>
      <PageHeader>
        <Container>
          <PageHeaderHeading>About Us</PageHeaderHeading>
          <PageHeaderDescription>We are a team of passionate language teachers and developers who have come together to help motivated people improve their ability to speak, read and write foreign languages.</PageHeaderDescription>
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {teammembers.map((member, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="relative w-full aspect-square mb-2">
                        <Image
                          src={member.LinkPicture}
                          alt={member.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-center font-medium">{member.name}</p>
                    </div>
                  ))}
                </div>
              </div>
        </Container>
      </PageHeader>
    </Page>
  );
}
